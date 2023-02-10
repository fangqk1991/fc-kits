import { ApiOptions, AxiosBuilder } from '@fangcha/app-request'
import { MessageBox } from 'element-ui'
import { i18n } from '../src/i18n'
import AppError, { ErrorModel } from '@fangcha/app-error'

function showAlert(content: any, title: any) {
  if (content.errorMessage) {
    content = content.errorMessage
  }
  MessageBox.alert(content, title, {
    confirmButtonText: 'OK',
    showClose: false,
  })
}

export const AxiosSettings = {
  loginUrl: '/api/v1/login',
}

export class _MyAxios extends AxiosBuilder {
  useRedirecting = true
  constructor() {
    super()
    this.addHeader('x-requested-with', 'XMLHttpRequest')
    this.setErrorHandler((err) => {
      const responseData = this.axiosResponse?.data as ErrorModel
      switch (err.statusCode) {
        case 401: {
          if (this.useRedirecting) {
            if (AxiosSettings.loginUrl !== window.location.pathname) {
              window.location.href = `${AxiosSettings.loginUrl}?redirectUri=${encodeURIComponent(window.location.href)}`
            }
            return
          }
          break
        }
        default: {
          break
        }
      }

      if (this._subErrorHandler) {
        this._subErrorHandler(err)
      }

      const i18nPhrase = responseData?.phrase
      let errMessage = (i18nPhrase && i18n.te(i18nPhrase) ? i18n.t(i18nPhrase) : i18nPhrase) as string
      if (!errMessage) {
        errMessage = typeof responseData === 'string' ? responseData : 'Unknown error'
      }
      if (this._errorMsgHandler) {
        this._errorMsgHandler(errMessage, i18nPhrase)
      } else if (!this._mute) {
        showAlert(errMessage, 'Error')
      }
      throw err
    })
  }

  protected _mute: boolean = false
  public setMute(mute: boolean) {
    this._mute = mute
  }

  protected _errorMsgHandler?: (errMsg: string, phrase: string) => void
  public setErrorMsgHandler(handler: (errMsg: string, phrase: string) => void) {
    this._errorMsgHandler = handler
  }

  protected _subErrorHandler?: (err: AppError) => void
}

export const MyAxios = (commonApi?: ApiOptions) => {
  const builder = new _MyAxios()
  if (commonApi) {
    builder.setApiOptions(commonApi)
  }
  return builder
}
