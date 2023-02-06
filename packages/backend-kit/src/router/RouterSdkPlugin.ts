import { RouterSdkOptions } from './RouterSdkOptions'
import { AppPluginProtocol } from '../basic'
import { RouterApp } from '@fangcha/router'
import { RouterPlugin } from './RouterPlugin'

export const RouterSdkPlugin = (options: RouterSdkOptions & { routerApp: RouterApp }): AppPluginProtocol => {
  return new RouterPlugin(options)
}
