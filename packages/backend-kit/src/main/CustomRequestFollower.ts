import { AxiosBuilder } from '@fangcha/app-request'
import AppError from '@fangcha/app-error'
import { BotCore } from '../alert/BotCore'
import { RequestFollower } from '@fangcha/app-request-extensions'

export class CustomRequestFollower extends RequestFollower {
  public static botProxy: BotCore

  onDisposeErrorMsg(errMsg: string, _client: AxiosBuilder, error: AppError) {
    if (error.statusCode >= 500 || error.statusCode === 404) {
      if (CustomRequestFollower.botProxy) {
        CustomRequestFollower.botProxy.notify(errMsg)
      }
    }
  }
}
