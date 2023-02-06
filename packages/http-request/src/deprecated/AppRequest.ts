import rp = require('request-promise')
import assert = require('assert')
import AppError from '@fangcha/app-error'

type ErrorHandler = (err: Error) => Promise<void> | void

/**
 * @deprecated AxiosBuilder is recommended
 */
export class AppRequest {
  public method: string
  public uri: string
  private _options: any
  private _responseHeaders?: any
  private _handler?: ErrorHandler

  constructor(method: string, uri: string) {
    this.method = method
    this.uri = uri
    this._options = {
      method: method,
      uri: uri,
      timeout: 15000,
      headers: {},
      transform: (body: any, response: any, _resolveWithFullResponse: any) => {
        this._responseHeaders = response.headers
        return body
      },
    }
  }

  addHeader(key: string, value: string) {
    this._options.headers[key] = value
  }

  setHeaders(headers: {}) {
    this._options.headers = headers
  }

  setResponseJSON(bool: boolean) {
    this._options.json = bool
  }

  setNullEncoding() {
    this._options.encoding = null
    this._options.json = false
  }

  setTimeout(timeout: number) {
    this._options.timeout = timeout
  }

  setFormData(formData: {}) {
    assert.ok(typeof formData === 'object')
    this._options.formData = formData
  }

  setBody(data: {} | string) {
    this._options.body = data
  }

  addExtras(extras: {}) {
    Object.assign(this._options, extras)
  }

  setErrorHandler(handler: ErrorHandler) {
    this._handler = handler
  }

  getResponseHeaders() {
    return this._responseHeaders
  }

  async execute() {
    const forceJSON = this._options.json || false

    try {
      const response = await rp(this._options)
      if (forceJSON && typeof response === 'string') {
        throw new AppError('JSON parse error')
      }
      return response
    } catch (err: any) {
      if (this._handler) {
        await this._handler(err)
        return
      }
      const statusCode = err.statusCode || 500
      const message = err.body || err.error || err.message
      const extras = err.error
      throw new AppError(message, statusCode, extras)
    }
  }

  async downloadBuffer() {
    const options = this._options
    options.encoding = null
    let buffer
    try {
      buffer = await rp(options)
    } catch (err: any) {
      if (this._handler) {
        await this._handler(err)
        return
      }
      const statusCode = err.statusCode || 500
      const message = err.body || err.error || err.message
      const extras = err.error
      throw new AppError(message, statusCode, extras)
    }
    return buffer
  }
}
