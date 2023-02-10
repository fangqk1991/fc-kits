import { Component, MenuMainNode, MenuSubNode, Prop, ViewController, VisibleLevel } from '../../src'
import { NotificationCenter } from 'notification-center-js'
import { makeUUID } from '@fangcha/tools'

@Component({
  template: `
    <el-menu :default-active="$route.path" :default-openeds="defaultOpeneds" :collapse="collapse" :unique-opened="uniqueOpened">
      <el-submenu
        v-for="menu in menus"
        :key="menu.uid"
        :index="menu.uid"
        popper-class="sidebar-popper"
      >
        <template slot="title">
          <i class="title-icon" :class="menu.icon" />
          <span slot="title">{{ $i18n.locale === 'zh' ? menu.titleZh : menu.titleEn }}</span>
        </template>
        <el-menu-item
          v-for="link in getMenuVisibleLinks(menu)"
          :key="uniqueKeyForLink(link)"
          :index="uniqueKeyForLink(link)"
          :disabled="!$app.checkPathAccessible(link.path)"
        >
          <a v-if="link.onClick" href="javascript:" @click="link.onClick">
            <div style="display: inline-block; width: 100%">
              <span style="margin-right: 8px">▪</span>
              <span>{{ $i18n.locale === 'zh' ? link.titleZh : link.titleEn }}</span>
            </div>
          </a>
          <a v-else-if="link.isHyperlink" :href="link.url" target="_blank">
            <div style="display: inline-block; width: 100%">
              <span style="margin-right: 8px">▪</span>
              <span>{{ $i18n.locale === 'zh' ? link.titleZh : link.titleEn }}</span>
            </div>
          </a>
          <router-link v-else :to="{ path: link.path }">
            <div style="display: inline-block; width: 100%;">
              <span style="margin-right: 8px">▪</span>
              <span>{{ $i18n.locale === 'zh' ? link.titleZh : link.titleEn }}</span>
            </div>
          </router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  `,
})
export class AppMenu extends ViewController {
  @Prop({ default: false, type: Boolean }) readonly collapse!: boolean
  @Prop({ default: false, type: Boolean }) readonly uniqueOpened!: boolean

  sidebarOptions: MenuMainNode[] = []
  defaultOpeneds: string[] = []

  uniqueKeyForLink(link: MenuSubNode) {
    if (link.path) {
      return link.path
    }
    if (link.url) {
      return link.url
    }
    return makeUUID()
  }

  viewDidLoad() {
    this.reloadSidebar()
    if (!this.uniqueOpened) {
      this.defaultOpeneds = this.sidebarOptions.map((item) => item.uid!)
    }
    NotificationCenter.defaultCenter().addObserver('__onSidebarOptionsChanged', () => {
      this.reloadSidebar()
    })
  }

  getMenuVisibleLinks(menu: MenuMainNode) {
    return menu.links.filter((link) => {
      if (link.visible !== undefined) {
        if (typeof link.visible === 'function') {
          return !!link.visible()
        }
        return link.visible
      }
      return link.visibleLevel !== VisibleLevel.Private || this.$app.checkPathAccessible(link.path!)
    })
  }

  get menus() {
    return this.sidebarOptions.filter((menu) => {
      if (menu.visible !== undefined) {
        if (typeof menu.visible === 'function') {
          return !!menu.visible()
        }
        return menu.visible
      }
      return this.getMenuVisibleLinks(menu).length > 0
    })
  }

  reloadSidebar() {
    this.sidebarOptions = this.$app.sidebarNodes()
  }
}
