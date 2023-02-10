import { Vue } from 'vue-property-decorator'
import { NavigationGuard, RouteConfig } from 'vue-router'
import { VisitorInfo } from '@fangcha/tools'
import { MenuMainNode } from '../src/sidebars'
import { EmptyConfig, FrontendPluginProtocol } from '../basic'
import { BasicAppConfig } from '../app'

export interface AdminCssStyle {
  appHeader?: {
    textColor?: string
    background?: string
  }
}

export interface AdminAppConfig<T extends EmptyConfig = {}> extends BasicAppConfig<T> {
  appName: string
  routes: RouteConfig[]
  appWillLoad?: () => Promise<void> | void
  appDidLoad?: () => Promise<void> | void
  pluginsDidLoad?: () => Promise<void>
  guardBeforeEachRoute?: NavigationGuard
  mainLayout?: typeof Vue
  homeView?: typeof Vue
  plugins?: FrontendPluginProtocol[] | (() => Promise<FrontendPluginProtocol[]>)

  useRemoteLocale?: boolean
  profileViewUrl?: string

  sidebarNodes: MenuMainNode[]
  reloadUserInfo?: () => Promise<VisitorInfo>

  loginUrl?: string
  logoutUrl?: string

  sidebarUniqueOpened?: boolean
  view403?: { new (): Vue }
  allowAnonymous?: boolean

  style?: AdminCssStyle
}
