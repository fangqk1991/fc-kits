import { AxiosBuilder } from '@fangcha/app-request'
import { ErrorModel } from '@fangcha/app-error'

interface ClassOptions {
  loginUrl?: string
  alertHandler?: (errMsg: string) => void
  errorMsgParser?: (responseData: any) => string
}

export class HttpRequest extends AxiosBuilder {
  protected static _classOptions: Required<ClassOptions> = {
    loginUrl: '/api/v1/login',
    alertHandler: () => {},
    errorMsgParser: (responseData: any) => {
      let errMessage = responseData?.phrase
      if (!errMessage) {
        errMessage = typeof responseData === 'string' ? responseData : 'Unknown error'
      }
      return errMessage
    },
  }
  public static updateClassOptions(options: Partial<ClassOptions>) {
    Object.assign(this._classOptions, options)
  }

  useRedirecting = true

  protected _mute: boolean = false
  public setMute(mute: boolean) {
    this._mute = mute
  }

  constructor() {
    super()
    const options = this.constructor['_classOptions'] as Required<ClassOptions>
    this.addHeader('x-requested-with', 'XMLHttpRequest')
    this.setErrorHandler((err) => {
      const responseData = this.axiosResponse?.data as ErrorModel
      switch (err.statusCode) {
        case 401: {
          if (this.useRedirecting) {
            if (options.loginUrl !== window.location.pathname) {
              window.location.href = `${options.loginUrl}?redirectUri=${encodeURIComponent(window.location.href)}`
            }
            return
          }
          break
        }
        default: {
          break
        }
      }
      const errMessage = options.errorMsgParser(responseData)
      if (!this._mute) {
        options.alertHandler(errMessage)
      }
      throw err
    })
  }
}
