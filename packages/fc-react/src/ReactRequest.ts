import { ApiOptions } from '@fangcha/app-request'
import { HttpRequest } from './HttpRequest'

export const ReactRequest = (commonApi?: ApiOptions) => {
  const builder = new HttpRequest()
  if (commonApi) {
    builder.setApiOptions(commonApi)
  }
  return builder
}
