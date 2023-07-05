import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { HuilianyiTokenKeeper } from './HuilianyiTokenKeeper'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiResponse, } from '../core/HuilianyiModels'
import AppError from '@fangcha/app-error'

export class HuilianyiProxyBase extends ServiceProxy<BasicAuthConfig> {
  protected _tokenKeeper: HuilianyiTokenKeeper

  constructor(config: BasicAuthConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new HuilianyiTokenKeeper(config, observerClass)
  }

  public async makeRequest(commonApi: ApiOptions) {
    const accessToken = await this._tokenKeeper.requireTenantAccessToken()
    const request = axiosBuilder()
      .setBaseURL(this._tokenKeeper.baseURL())
      .addHeader('Authorization', `Bearer ${accessToken}`)
      .setApiOptions(commonApi)
      .setTimeout(60000)
      .setResponse200Checker((responseData: HuilianyiResponse<any>) => {
        if (responseData.errorCode !== undefined && responseData.errorCode !== '0000') {
          const errorPrefix = `API[${commonApi.description}] error:`
          throw new AppError(`${errorPrefix} ${responseData.message} [${responseData.errorCode}]`, 400, responseData)
        }
      })
    this.onRequestMade(request)
    return request
  }

}
