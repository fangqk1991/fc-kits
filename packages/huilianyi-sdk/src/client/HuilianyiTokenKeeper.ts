import { BasicAuthProxy, RequestFollower } from '@fangcha/app-request-extensions'
import { BasicAuthConfig, ChannelTask } from '@fangcha/tools'
import { HuilianyiApis } from './HuilianyiApis'

/**
 * https://opendocs.huilianyi.com/implement.html#%E8%8E%B7%E5%8F%96accesstoken
 */
export class HuilianyiTokenKeeper extends BasicAuthProxy {
  private _tenantAccessToken: string = ''
  private _expireTs: number = 0
  private _refreshTokenTask: ChannelTask<string>

  public baseURL() {
    return this._config.urlBase
  }

  constructor(config: BasicAuthConfig, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this._refreshTokenTask = new ChannelTask(async () => {
      const request = this.makeRequest(HuilianyiApis.AccessTokenRequest)
      request.setFormUrlEncoded({
        grant_type: 'client_credentials',
        scope: 'write',
      })
      this.onRequestMade(request)
      const response = (await request.quickSend()) as {
        access_token: string
        token_type: 'bearer'
        expires_in: number // 单位: 秒
        scope: 'write'
        tenantId: string
      }
      this._tenantAccessToken = response.access_token
      this._expireTs = Date.now() + response.expires_in * 1000
      return this._tenantAccessToken
    })
  }

  public async refreshTenantAccessToken() {
    return this._refreshTokenTask.execute()
  }

  public async requireTenantAccessToken() {
    // 到期时间不足 120s
    if (this._expireTs - Date.now() < 120000) {
      await this.refreshTenantAccessToken()
    }
    return this._tenantAccessToken
  }
}
