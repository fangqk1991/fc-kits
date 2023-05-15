import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { HuilianyiTokenKeeper } from './HuilianyiTokenKeeper'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiApis } from './HuilianyiApis'
import { HuilianyiResponse } from './HuilianyiModels'

export class HuilianyiProxy extends ServiceProxy<BasicAuthConfig> {
  private _tokenKeeper: HuilianyiTokenKeeper

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
      .setTimeout(15000)
    // request.setErrorParser((client, error) => {
    //   let message = error.message
    //   if (client.axiosError?.response?.data && typeof client.axiosError?.response.data === 'object') {
    //     const data = client.axiosError?.response.data as HuilianyiResponse<any>
    //     error.extras = data
    //     message = `${data.msg}[${data.code}]`
    //   }
    //   const errorPrefix = `API[${commonApi.description}] error:`
    //   return new AppError(`${errorPrefix} ${message}`, error.statusCode, error.extras)
    // })
    this.onRequestMade(request)
    return request
  }

  public async getCompanyList() {
    const request = await this.makeRequest(new CommonAPI(HuilianyiApis.CompanyListGet))
    request.setQueryParams({
      page: 1,
      size: 100,
    })
    return (await request.quickSend()) as HuilianyiResponse<any>
  }
}