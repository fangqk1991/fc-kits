import { RequestFollower } from '@fangcha/tools/lib/request'
import { AxiosBuilder } from '@fangcha/app-request'
import AppError from '@fangcha/app-error'
import { WecomProxy } from '../alert'

export class CustomRequestFollower extends RequestFollower {
  public static botProxy: WecomProxy

  onDisposeErrorMsg(errMsg: string, _client: AxiosBuilder, error: AppError) {
    if (error.statusCode >= 500 || error.statusCode === 404) {
      if (CustomRequestFollower.botProxy) {
        CustomRequestFollower.botProxy.notify(errMsg)
      }
    }
  }
}
