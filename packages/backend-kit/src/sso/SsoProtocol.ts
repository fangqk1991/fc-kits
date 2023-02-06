import { OAuthClientConfig } from '@fangcha/tools/lib/oauth-client'

export interface SsoProtocol<T = any> {
  oauthConfig: OAuthClientConfig
  getUserInfo: (accessToken: string) => Promise<T>
}
