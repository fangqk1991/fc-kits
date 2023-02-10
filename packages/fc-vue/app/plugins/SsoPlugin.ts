import 'bootstrap'
import Vue from 'vue'
import { AxiosSettings, FrontendPluginProtocol, Session } from '../../basic'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'

export const SsoPlugin = (): FrontendPluginProtocol => {
  Vue.prototype.$session = new Session()
  AxiosSettings.loginUrl = KitAuthApis.RedirectLogin.route
  return {
    onAppDidLoad: async () => {},
  }
}
