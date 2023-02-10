import { RouteConfig } from 'vue-router'
import { LocaleDict } from '../src/i18n'

export interface FrontendPluginProtocol {
  onAppWillLoad?: () => void
  onAppDidLoad?: () => Promise<void>
  routes?: RouteConfig[]
  independentRoutes?: RouteConfig[]
  i18nMap?: LocaleDict
  vueFuncMap?: { [funcName: string]: Function }
}
