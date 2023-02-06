import { AppPluginProtocol } from '../basic'
import { SsoSpecDocItem } from './WebSsoSpecs'
import { _SsoState } from './_SsoState'
import { OAuthClientConfig } from '@fangcha/tools/lib/oauth-client'
import { axiosGET } from '@fangcha/app-request'

export const TypicalSsoSdkPlugin = (oauthConfig: OAuthClientConfig & { userInfoURL: string }): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _SsoState.setSsoProtocol({
        oauthConfig: oauthConfig,
        getUserInfo: async (accessToken: string) => {
          const request = axiosGET(oauthConfig.userInfoURL)
          request.addHeader('Authorization', `Bearer ${accessToken}`)
          return request.quickSend()
        },
      })
    },
    specDocItems: [SsoSpecDocItem],
  }
}
