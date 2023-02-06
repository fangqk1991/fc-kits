import { FangchaApp } from '../main'
import { AppProtocol } from '../basic'
import { HealthDocItem } from './retained-specs/HealthSpecs'
import { _RouterState } from './_RouterState'
import { RouterSdkOptions } from './RouterSdkOptions'
import { RouterPlugin } from './RouterPlugin'
import { JwtSessionSpecDocItem } from './retained-specs/JwtSessionSpecs'
import { SwaggerDocItem } from '@fangcha/router'

interface WebAppExtras {
  routerOptions: RouterSdkOptions
  useJwtSpecs?: boolean
  mainDocItems?: SwaggerDocItem[]
}

export class WebApp extends FangchaApp {
  routerPlugin: RouterPlugin

  public constructor(protocol: AppProtocol & WebAppExtras) {
    super(protocol)

    const routerApp = _RouterState.routerApp
    if (protocol.mainDocItems) {
      routerApp.addDocItem(...protocol.mainDocItems)
    }
    routerApp.addDocItem(HealthDocItem)
    if (protocol.useJwtSpecs || protocol.routerOptions.jwtProtocol) {
      routerApp.addDocItem(JwtSessionSpecDocItem)
    }

    this.routerPlugin = new RouterPlugin({
      ...protocol.routerOptions,
      routerApp: routerApp,
    })
    _RouterState.routerPlugin = this.routerPlugin

    this.protocol.plugins = [this.routerPlugin, ...this.protocol.plugins]
  }
}
