import { RouteConfig } from 'vue-router'
import { NotificationCenter } from 'notification-center-js'
import { I18nCode, makeUUID, VisitorInfo } from '@fangcha/tools'
import { BasicApp } from '../app'
import { MenuMainNode, MenuSubNode } from '../src/sidebars'
import { i18n } from '../src/i18n'
import { AxiosSettings } from '../basic'
import { AppView } from './views/AppView'
import { AdminAppConfig, AdminCssStyle } from './AdminAppConfig'
import 'bootstrap'

export class AdminApp extends BasicApp {
  public config!: AdminAppConfig

  isReady = false
  // 为做到响应式而进行赋值
  public visitorInfo: VisitorInfo = null as any

  public style: AdminCssStyle = {
    appHeader: {
      textColor: '',
      background: '',
    },
  }

  pathRouteMap: { [path: string]: RouteConfig } = {}

  public constructor(options: AdminAppConfig) {
    super(options)
    {
      const allNodes = this.sidebarNodes().reduce((result, cur) => {
        result = result.concat(cur.links)
        return result
      }, [] as MenuSubNode[])
      options.guardBeforeEachRoute = async (to, _from, next) => {
        await this.waitForReady()
        const keyNode = allNodes.find((menuNode) => menuNode.path && to.path.startsWith(menuNode.path))
        let title = this.appName()
        if (keyNode) {
          title = `${title} - ${i18n.locale === 'zh' ? keyNode.titleZh : keyNode.titleEn}`
        }
        this.setTitle(title)
        next()
      }
    }
    {
      const routes = this.config.routes!
      const pathRouteMap: { [path: string]: RouteConfig } = {}
      const searchSubRoutes = (node: RouteConfig, pathPrefix = '') => {
        const curPath = `${pathPrefix}${node.path}`
        pathRouteMap[curPath] = node
        if (node.children) {
          for (const route of node.children) {
            searchSubRoutes(route, curPath)
          }
        }
      }
      searchSubRoutes({
        path: '',
        children: routes,
      })
      this.pathRouteMap = pathRouteMap
    }
    options.loginUrl = options.loginUrl || '/api/v1/login'
    options.logoutUrl = options.logoutUrl || '/api/v1/logout'
    options.mainLayout = AppView
    AxiosSettings.loginUrl = options.loginUrl
    options.profileViewUrl = options.profileViewUrl || '#'

    const style: AdminCssStyle = {
      ...(options.style || {}),
    }
    style.appHeader = style.appHeader || {}
    style.appHeader.textColor = style.appHeader.textColor || ''
    style.appHeader.background = style.appHeader.background || ''
    this.style = style
  }

  public async reloadUserInfo() {
    if (this.config.reloadUserInfo) {
      this.visitorInfo = await this.config.reloadUserInfo!()
    } else if (this.session.curUser) {
      const email = this.session.curUser.email || ''
      this.visitorInfo = {
        iamId: 0,
        email: email,
        name: email.split('@')[0],
        permissionKeyMap: {},
        // isAdmin: true,
        locale: I18nCode.en,
      }
    } else {
      this.visitorInfo = null as any
    }
    if (this.config.useRemoteLocale) {
      this.setLocale(this.visitorInfo.locale)
    }
    return this.visitorInfo
  }

  public updateMenu(menuUid: string, params: Partial<MenuMainNode>) {
    const sidebarNode = this.config.sidebarNodes.find((item) => item.uid === menuUid)
    if (sidebarNode) {
      if (params.titleEn !== undefined) {
        sidebarNode.titleEn = params.titleEn
      }
      if (params.titleZh !== undefined) {
        sidebarNode.titleZh = params.titleZh
      }
      if (params.icon !== undefined) {
        sidebarNode.icon = params.icon
      }
      if (params.links !== undefined) {
        sidebarNode.links = params.links
      }
      NotificationCenter.defaultCenter().postNotification('__onSidebarOptionsChanged')
    }
  }

  public updateMenuLinks(menuUid: string, links: MenuSubNode[]) {
    const sidebarNode = this.config.sidebarNodes.find((item) => item.uid === menuUid)
    if (sidebarNode) {
      sidebarNode.links = links
      NotificationCenter.defaultCenter().postNotification('__onSidebarOptionsChanged')
    }
  }

  public sidebarNodes() {
    return this.config.sidebarNodes.map((item) => {
      item.uid = item.uid || makeUUID()
      return item
    })
  }

  public checkPathAccessible(path: string) {
    const permissionKey = this.getPathPermissionKey(path)
    return !permissionKey || !!this.visitorInfo.permissionKeyMap[permissionKey]
  }

  public getPathPermissionKey(path: string) {
    const route = this.pathRouteMap[path]
    if (route) {
      // TODO: require 不是规范用法，需要调整为 meta.requirePermissionKey
      return route['require'] || ''
    }
    return ''
  }

  protected async _appDidLoad() {
    if (!this.config.allowAnonymous) {
      await this.reloadUserInfo()
    }
  }

  public hasPermission(permissionKey: string) {
    return !!this.visitorInfo.permissionKeyMap[permissionKey]
  }

  public isAdministrator() {
    return !!this.visitorInfo.isAdmin
  }
}
