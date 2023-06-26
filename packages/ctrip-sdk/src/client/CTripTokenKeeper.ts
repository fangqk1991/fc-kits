import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
import { ChannelTask } from '@fangcha/tools'
import { ApiOptions, axiosBuilder } from '@fangcha/app-request'
import { CTripResponseDTO } from '../core/CTrip_CoreModels'
import { CTripOptions } from './CTripOptions'
import { CTripDataApis } from './CTripDataApis'
import AppError from '@fangcha/app-error'

/**
 * https://openapi.ctripbiz.com/#/serviceApi?apiId=1000158
 */
export class CTripTokenKeeper extends ServiceProxy<CTripOptions> {
  private _ticket: string = ''
  private _expireTs: number = 0
  private _refreshTokenTask: ChannelTask<string>

  public baseURL() {
    return this._config.urlBase
  }

  constructor(config: CTripOptions, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._refreshTokenTask = new ChannelTask(async () => {
      const request = this.makeRequest(CTripDataApis.OrderTicketRequest)
      request
        .setBodyData({
          AppKey: config.appKey,
          AppSecurity: config.appSecurity,
        })
        .setResponse200Checker((responseData: CTripResponseDTO) => {
          if (responseData.Status !== undefined && responseData.Status.ErrorCode !== 0) {
            const errorPrefix = `API[${CTripDataApis.OrderTicketRequest.description}] error:`
            throw new AppError(
              `${errorPrefix} ${responseData.Status.Message} [${responseData.Status.ErrorCode}]`,
              400,
              responseData
            )
          }
        })
      this.onRequestMade(request)
      const response = await request.quickSend<CTripResponseDTO<{ Ticket: string }>>()
      this._ticket = response.Ticket
      this._expireTs = Date.now() + 7200 * 1000
      return this._ticket
    })
  }

  public makeRequest(commonApi: ApiOptions) {
    const request = axiosBuilder().setBaseURL(this._config.urlBase).setApiOptions(commonApi).setTimeout(15000)
    this.onRequestMade(request)
    return request
  }

  public async refreshTicket() {
    return this._refreshTokenTask.execute()
  }

  public async requireTicket() {
    // 到期时间不足 60s
    if (this._expireTs - Date.now() < 60000) {
      await this.refreshTicket()
    }
    return this._ticket
  }
}
