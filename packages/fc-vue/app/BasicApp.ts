import '../src/plugins/element-ui-plugin'
import '../fangcha/fc-styles.scss'
import { BasicAppProtocol } from './BasicAppProtocol'
import { Component, Vue } from 'vue-property-decorator'
import VueRouter, { RouteConfig } from 'vue-router'
import * as moment from 'moment'
import { extendsI18n, i18n } from '../src/i18n'
import { NotificationCenter } from 'notification-center-js'
import { Page404 } from './views/Page404'
import { I18nCode, I18nCodeDescriptor, MyConstants, MyNotificationKeys, SimpleVisitor, sleep } from '@fangcha/tools'
import { RootView } from '../src/RootView'
import { ViewController } from '../src/ViewController'
import { BasicAppConfig } from './BasicAppConfig'
import { EmptyConfig, FrontendPluginProtocol, Session } from '../basic'
import { SystemI18n } from './i18n/SystemI18n'
const cookie = require('cookie-browser')

extendsI18n(SystemI18n)

Vue.filter('ISO8601', (val: any) => {
  return moment(val).format()
})
Vue.filter('Unix_To_ISO8601', (val: any) => {
  return moment.unix(val).format()
})
Vue.filter('describe_locale', (val: any) => {
  return I18nCodeDescriptor.describe(val)
})
Vue.filter('digit_format', (n: number | string, digits: number = 2, maximumFractionDigits: number | null = null) => {
  if (n === '' || n === null || n === undefined) {
    return ''
  }
  if (maximumFractionDigits === null) {
    maximumFractionDigits = digits
  }
  const config =
    digits === 0 && maximumFractionDigits === 0
      ? {}
      : { maximumFractionDigits: maximumFractionDigits, minimumFractionDigits: digits }
  return Number(n).toLocaleString('en-US', config)
})
Vue.filter('size_format', (size: number) => {
  let unit
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024
  }
  return `${unit === 'B' ? size : size.toFixed(2)}${unit}`
})

export class BasicApp<T extends EmptyConfig = {}> implements BasicAppProtocol {
  public config!: BasicAppConfig<T>
  public isReady = false
  public router!: VueRouter
  public session!: Session<T>
  protected _plugins: FrontendPluginProtocol[] = []

  // 为做到响应式而进行赋值
  public visitorInfo: SimpleVisitor = null as any

  public appName() {
    return this.config.appName || ''
  }

  public constructor(options: BasicAppConfig<T>) {
    this.config = options
    if (options.appName) {
      this.setTitle(options.appName)
    }
    this.setSession(options.session || Vue.prototype.$session || new Session<T>())
  }

  public setSession(session: Session<T>) {
    this.session = session
    Vue.prototype.$session = session
  }

  public setLocale(locale: I18nCode) {
    cookie.set(MyConstants.CookieKeyForLocale, locale, 'Fri, 31 Dec 9999 23:59:59 GMT', '/')
    i18n.locale = locale === I18nCode.zhHans ? 'zh' : 'en'
    NotificationCenter.defaultCenter().postNotification(MyNotificationKeys.kOnSystemLanguageChanged, locale)
  }

  public getLocale(): I18nCode {
    let locale = cookie.get(MyConstants.CookieKeyForLocale)
    if (!locale) {
      const userLang = navigator.language
      locale = userLang === 'zh-CN' ? I18nCode.zhHans : I18nCode.en
    }
    return I18nCodeDescriptor.checkValueValid(locale) ? locale : I18nCode.en
  }

  private MainLayout() {
    @Component({
      template: `<router-view />`,
    })
    class MainLayout extends ViewController {}
    return MainLayout
  }

  protected prepareRouter() {
    const routes: RouteConfig[] = []
    const independentRoutes: RouteConfig[] = []
    if (this.config.homeView) {
      routes.push({
        path: '/',
        component: this.config.homeView,
        name: 'HomeView',
      })
    }
    for (const plugin of this._plugins) {
      if (plugin.routes) {
        routes.push(...plugin.routes)
      }
      if (plugin.independentRoutes) {
        independentRoutes.push(...plugin.independentRoutes)
      }
    }
    if (this.config.routes) {
      routes.push(...this.config.routes)
    }
    if (this.config.independentRoutes) {
      independentRoutes.push(...this.config.independentRoutes)
    }
    routes.push({
      path: '*',
      component: Page404,
      name: 'Page404',
    })
    const router = new VueRouter({
      mode: 'history',
      routes: [
        ...independentRoutes,
        {
          path: this.config.mainPathPrefix || '',
          component: this.config.mainLayout || this.MainLayout(),
          children: routes,
        },
      ],
    })
    router.beforeEach(async (to, from, next) => {
      await this.waitForReady()
      if (this.config.guardBeforeEachRoute) {
        return this.config.guardBeforeEachRoute(to, from, next)
      }
      next()
    })
    this.router = router
    return router
  }

  protected async _appDidLoad() {}

  public launch() {
    i18n.locale = this.getLocale() === I18nCode.zhHans ? 'zh' : 'en'
    Vue.use(VueRouter)
    Vue.prototype.$app = this

    const handler = async () => {
      const appWillLoad = this.config.appWillLoad || (() => {})
      await appWillLoad()

      if (this.config.i18nMap) {
        extendsI18n(this.config.i18nMap)
      }
      if (this.config.vueFuncMap) {
        Object.keys(this.config.vueFuncMap).forEach((key) => {
          Vue.filter(key, this.config.vueFuncMap![key])
        })
      }

      {
        const items = this.config.plugins || []
        if (Array.isArray(items)) {
          this._plugins = items
        } else {
          this._plugins = await items()
        }
      }

      const router = this.prepareRouter()
      const plugins = this._plugins
      for (const plugin of plugins) {
        if (plugin.onAppWillLoad) {
          plugin.onAppWillLoad()
        }
        if (plugin.i18nMap) {
          extendsI18n(plugin.i18nMap)
        }
        if (plugin.vueFuncMap) {
          Object.keys(plugin.vueFuncMap).forEach((key) => {
            Vue.filter(key, plugin.vueFuncMap![key])
          })
        }
      }

      const rootView = new RootView({
        el: '#app',
        router: router,
        i18n: i18n,
      })

      await this.session.reloadSessionInfo()
      if (this.config.refreshIfVersionChanged) {
        await this.session.handleIfCodeVersionChanged(async () => {
          window.location.reload()
        })
      }

      await this._appDidLoad()

      const appDidLoad = this.config.appDidLoad || (async () => {})
      await appDidLoad()
      for (const plugin of plugins) {
        if (plugin.onAppDidLoad) {
          await plugin.onAppDidLoad()
        }
      }
      const pluginsDidLoad = this.config.pluginsDidLoad || (async () => {})
      await pluginsDidLoad()
      this.isReady = true
      rootView.isReady = true
    }
    handler()
  }

  public async waitForReady() {
    while (!this.isReady) {
      console.info(`App is waiting for ready...`)
      await sleep(100)
    }
  }

  public setTitle(title: string) {
    document.title = title
  }
}
