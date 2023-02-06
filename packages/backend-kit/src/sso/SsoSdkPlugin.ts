import { AppPluginProtocol } from '../basic'
import { SsoProtocol } from './SsoProtocol'
import { SsoSpecDocItem } from './WebSsoSpecs'
import { _SsoState } from './_SsoState'

export const SsoSdkPlugin = (options: SsoProtocol): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _SsoState.setSsoProtocol(options)
    },
    specDocItems: [SsoSpecDocItem],
  }
}
