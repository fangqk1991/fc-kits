import { ApiOptions, axiosBuilder, CommonAPI } from '@fangcha/app-request'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { CTripTokenKeeper } from './CTripTokenKeeper'
import AppError from '@fangcha/app-error'
import { CTripOptions } from './CTripOptions'
import { CTripResponseDTO } from '../core/CTrip_CoreModels'
import { CTripDataApis } from './CTripDataApis'

export class CTripProxy extends ServiceProxy<CTripOptions> {
  protected _tokenKeeper: CTripTokenKeeper

  constructor(config: CTripOptions, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._tokenKeeper = new CTripTokenKeeper(config, observerClass)
  }

  public async makeRequest(commonApi: ApiOptions) {
    const ticket = await this._tokenKeeper.requireTicket()
    const request = axiosBuilder()
      .setBaseURL(this._tokenKeeper.baseURL())
      .setApiOptions(commonApi)
      .setBodyData({
        Auth: {
          AppKey: this._config.appKey,
          Ticket: ticket,
        },
      })
      .setTimeout(15000)
      .setResponse200Checker((responseData: CTripResponseDTO) => {
        if (responseData.Status !== undefined && responseData.Status.ErrorCode !== 0) {
          const errorPrefix = `API[${commonApi.description}] error:`
          throw new AppError(
            `${errorPrefix} ${responseData.Status.Message} [${responseData.Status.ErrorCode}]`,
            400,
            responseData
          )
        }
      })
    this.onRequestMade(request)
    return request
  }

  public async searchOrder() {
    const request = await this.makeRequest(new CommonAPI(CTripDataApis.OrderSearch))
    request.setBodyData({
      ...request.bodyData,
      DateFrom: '2023-06-25',
      DateTo: '2023-06-25',
    })
    return await request.quickSend<CTripResponseDTO>()
  }
}
