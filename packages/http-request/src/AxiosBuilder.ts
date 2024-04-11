import { ApiOptions, CommonAPI } from './CommonAPI'
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method, ParamsSerializerOptions } from 'axios'
import * as FormData from 'form-data'
import { RequestObserverV2 } from './RequestObserverV2'
import AppError, { AppException, ErrorModel } from '@fangcha/app-error'
import * as qs from 'qs'
const axios = require('axios')

export type Response200Checker = (responseData: any) => Promise<void> | void

export type ErrorHandler = (error: AppError) => Promise<void> | void
export type ErrorParser = (client: AxiosBuilder, error: AppError) => AppError

interface ComplexFormDataValue {
  value: any
  options: {}
}

type FormDataValue = ComplexFormDataValue | any

export class AxiosBuilder {
  public baseURL: string
  public headers: { [p: string]: string }
  public queryParams: {}
  public axiosExtras: {}
  public bodyData: any
  public formData!: FormData
  public commonApi!: CommonAPI
  private _response200Checker?: Response200Checker
  private _errorHandler?: ErrorHandler
  private _errorParser?: ErrorParser
  public axiosError?: AxiosError
  public appError?: AppError
  public axiosResponse?: AxiosResponse
  private _observer?: RequestObserverV2
  private _startTs = 0
  private _endTs = 0
  public queryParamsSerializer: ParamsSerializerOptions = {
    serialize: (params: any) => {
      return qs.stringify(params, {
        arrayFormat: 'repeat',
      })
    },
  }

  constructor() {
    this.baseURL = ''
    this.headers = {}
    this.queryParams = {}
    this.axiosExtras = {}
    this._startTs = 0
  }

  public setBaseURL(baseURL: string) {
    this.baseURL = baseURL
    return this
  }

  public setErrorHandler(errorHandler: ErrorHandler) {
    this._errorHandler = errorHandler
    return this
  }

  public setResponse200Checker(response200Checker: Response200Checker) {
    this._response200Checker = response200Checker
    return this
  }

  public setErrorParser(errorParser: ErrorParser) {
    this._errorParser = errorParser
    return this
  }

  public setApiOptions(apiOptions: ApiOptions, ...replacements: (string | number)[]) {
    this.commonApi = new CommonAPI(apiOptions, ...replacements)
    return this
  }

  public setMethodAndURL(method: Method, url: string, ...replacements: (string | number)[]) {
    const apiOptions = {
      method: method,
      route: url,
    }
    this.setApiOptions(apiOptions, ...replacements)
    return this
  }

  public addHeader(key: string, value: string) {
    this.headers[key] = value
    return this
  }

  public addHeaders(headers: {}) {
    Object.assign(this.headers, headers)
    return this
  }

  public setQueryParams<T = {}>(queryParams: T) {
    this.queryParams = queryParams as any
    return this
  }

  public setFormUrlEncoded(formData: {}) {
    return this.setBodyData(
      qs.stringify(formData, {
        arrayFormat: 'repeat',
      })
    )
  }

  public setBodyData<T = any>(bodyData: T) {
    this.bodyData = bodyData
    return this
  }

  public setFormData(params: { [p: string]: FormDataValue }) {
    this.formData = new FormData()
    this.addFormData(params)
    return this
  }

  public addFormData(params: { [p: string]: FormDataValue }) {
    const formData = this.formData || new FormData()
    for (const key of Object.keys(params)) {
      const value = params[key]
      if (value && typeof value === 'object' && value.options && typeof value.value) {
        formData.append(key, value.value, value.options)
      } else {
        formData.append(key, value)
      }
    }
    this.formData = formData
    return this
  }

  public setTimeout(timeout: number) {
    return this.addAxiosConfig({
      timeout: timeout,
    })
  }

  public addAxiosConfig(extras: Partial<AxiosRequestConfig>) {
    this.axiosExtras = extras
    return this
  }

  public getRequestMethod() {
    return this.commonApi.method
  }

  public getRequestUrl() {
    let url = `${this.baseURL}${this.commonApi.api}`
    if (Object.keys(this.queryParams).length > 0) {
      url = `${url}?${this.queryParamsSerializer.serialize!(this.queryParams)}`
    }
    return url
  }

  public getHostname() {
    const url = `${this.baseURL}${this.commonApi.api}`
    return url.replace(/^https?:\/\//, '').split('/')[0]
  }

  /**
   * @deprecated
   */
  public getHomeName() {
    const url = `${this.baseURL}${this.commonApi.api}`
    return url.replace(/^https?:\/\//, '').split('/')[0]
  }

  public getProtocol() {
    const url = `${this.baseURL}${this.commonApi.api}`
    return url.split('://')[0]
  }

  public getDuration() {
    return Math.max(0, this._endTs - this._startTs)
  }

  public ignoreError() {
    this.setErrorHandler((err) => {
      console.error(err)
    })
  }

  public setObserver(observer: RequestObserverV2) {
    this._observer = observer
    return this
  }

  public async execute() {
    const options: AxiosRequestConfig = {
      method: this.commonApi.method as Method,
      url: this.commonApi.api,
      headers: this.headers,
    }

    if (this.baseURL) {
      options.baseURL = this.baseURL
    }
    if (Object.keys(this.queryParams).length > 0) {
      options.params = this.queryParams
      options.paramsSerializer = this.queryParamsSerializer
    }

    if (this.bodyData) {
      options.data = this.bodyData
    }

    if (this.formData) {
      Object.assign(options.headers!, this.formData.getHeaders())
      options.data = this.formData
    }

    Object.assign(options, this.axiosExtras)

    try {
      if (this._observer && this._observer.onRequestStart) {
        await this._observer.onRequestStart(this)
      }
      this._startTs = Date.now()
      this.axiosResponse = await axios.create().request(options)
      this._endTs = Date.now()
      if (this._response200Checker) {
        await this._response200Checker(this.axiosResponse?.data)
      }
      if (this._observer && this._observer.onRequestSuccess) {
        await this._observer.onRequestSuccess(this, this.axiosResponse?.data)
      }
      return this.axiosResponse
    } catch (e) {
      if (!this._endTs) {
        this._endTs = Date.now()
      }
      let statusCode = 500
      let message = 'Unknown error'

      const error = e as AxiosError<ErrorModel>
      if (error.name === 'AxiosError') {
        this.axiosError = error
        if (error.code === 'ECONNABORTED' || error.response === undefined) {
          message = `Request timeout, please try again later. Code: ${error.code}`
          statusCode = 504
        } else {
          const response = error.response!
          this.axiosResponse = response
          statusCode = response.status || 500
          if (response && response.data) {
            message = typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : response.data
          } else {
            message = error.message || response.statusText || 'Unknown error'
          }
        }
        this.appError = new AppError(message, statusCode, this.axiosResponse?.data || {})

        if (
          error.response &&
          error.response.data &&
          typeof error.response.data === 'object' &&
          error.response.data.phrase
        ) {
          const errorModel = error.response.data as ErrorModel
          this.appError = AppException.exception(error.response.data.phrase, {
            statusCode: statusCode,
            message: errorModel.message || message,
          })
        }
      } else if (error.name === 'AppError') {
        this.appError = e as AppError
      } else {
        this.appError = new AppError(error.message, statusCode, e)
      }

      if (this._errorParser) {
        this.appError = this._errorParser(this, this.appError)
      }

      if (this._observer && this._observer.onRequestFailure) {
        await this._observer.onRequestFailure(this, this.appError, error.response?.data)
      }
      if (this._errorHandler) {
        await this._errorHandler(this.appError)
      } else {
        // if (error.axiosResponse) {
        //   // The request was made and the server responded with a status code
        //   // that falls out of the range of 2xx
        //   logger.info('error.axiosResponse', error.axiosResponse)
        // } else if (error.request) {
        //   // The request was made but no axiosResponse was received
        //   // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //   // http.ClientRequest in node.js
        //   logger.info('error.request', error.request)
        // } else {
        //   // Something happened in setting up the request that triggered an Error
        //   logger.info('error.message', error.message)
        // }
        // logger.info(error.config)
        throw this.appError
      }
    }
  }

  public async quickSend<T = any>() {
    await this.execute()
    return this.axiosResponse?.data as T
  }
}

export const axiosBuilder = () => {
  return new AxiosBuilder()
}

export const axiosGET = (url: string, ...replacements: (string | number)[]) => {
  return new AxiosBuilder().setMethodAndURL('GET', url, ...replacements)
}

export const axiosPOST = (url: string, ...replacements: (string | number)[]) => {
  return new AxiosBuilder().setMethodAndURL('POST', url, ...replacements)
}

export const axiosPUT = (url: string, ...replacements: (string | number)[]) => {
  return new AxiosBuilder().setMethodAndURL('PUT', url, ...replacements)
}

export const axiosDELETE = (url: string, ...replacements: (string | number)[]) => {
  return new AxiosBuilder().setMethodAndURL('DELETE', url, ...replacements)
}

export const axiosDownload = (url: string, ...replacements: (string | number)[]) => {
  return new AxiosBuilder().setMethodAndURL('GET', url, ...replacements).addAxiosConfig({
    responseType: 'arraybuffer',
  })
}
