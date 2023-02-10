import { NavigationGuard, RouteConfig } from 'vue-router'
import { Vue } from 'vue-property-decorator'
import { EmptyConfig, FrontendPluginProtocol, Session } from '../basic'
import { LocaleDict } from '../src/i18n'

export interface BasicAppConfig<T extends EmptyConfig = {}> {
  session?: Session<T>
  appName?: string
  i18nMap?: LocaleDict
  vueFuncMap?: { [funcName: string]: Function }
  refreshIfVersionChanged?: boolean
  routes?: RouteConfig[]
  mainPathPrefix?: string
  independentRoutes?: RouteConfig[]
  appWillLoad?: () => Promise<void> | void
  appDidLoad?: () => Promise<void> | void
  pluginsDidLoad?: () => Promise<void>
  guardBeforeEachRoute?: NavigationGuard
  mainLayout?: typeof Vue
  homeView?: typeof Vue
  plugins?: FrontendPluginProtocol[] | (() => Promise<FrontendPluginProtocol[]>)
}
