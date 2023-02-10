import { Component } from 'vue-property-decorator'
import { AppSidebar } from './AppSidebar'
import { AppDropdownMenu } from './AppDropdownMenu'
import { Page403 } from './Page403'
import { LinkDropdownItem } from '../../src/widgets'
import { ViewController } from '../../src/ViewController'
import { I18nCode, I18nCodeDescriptor } from '@fangcha/tools'

@Component({
  components: {
    'app-sidebar': AppSidebar,
    'link-dropdown-item': LinkDropdownItem,
    'app-dropdown-menu': AppDropdownMenu,
    'page-403': Page403,
  },
  template: `
    <el-container class="fc-theme" style="height: 100vh; overflow-x: hidden; overflow-y: auto;">
      <el-header class="app-header" :style="$app.style.appHeader">
        <div class="title-wrapper">
          <app-dropdown-menu class="only-narrow-screen"/>
          <div class="title">
            <router-link to="/" :style="{ color: $app.style.appHeader.textColor || 'white' }">{{ $app.appName() }}</router-link>
          </div>
        </div>
        <div>
          <el-dropdown v-if="!$app.config.useRemoteLocale" @command="changeLocale">
            <span class="el-dropdown-link only-wide-screen"> {{ locale() | describe_locale }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="option in i18nCodeOptions" :key="option.value" :command="option.value">{{ option.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-if="$app.visitorInfo" class="ml-2">
            <span class="el-dropdown-link"> {{ $app.visitorInfo.email }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <link-dropdown-item :link="$app.config.profileViewUrl" :use-router="true">
                {{ $app.visitorInfo.name }}
                <el-tag v-if="$app.visitorInfo.isAdmin" size="mini">管理员</el-tag>
              </link-dropdown-item>
              <link-dropdown-item v-if="$app.config.useRemoteLocale" :link="$app.config.profileViewUrl" :use-router="true">
                {{ locale() | describe_locale }} <i class="el-icon-setting"></i>
              </link-dropdown-item>
              <link-dropdown-item :link="$app.config.logoutUrl">{{ LS('Logout') }}</link-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <app-sidebar class="only-wide-screen"/>
        <el-main>
          <router-view v-if="$app.checkPathAccessible($route.path)" :key="$route.path" />
          <page-403 v-else :permission-key="$app.getPathPermissionKey($route.path)" />
        </el-main>
      </el-container>
    </el-container>
  `,
})
export class AppView extends ViewController {
  i18nCodeOptions = I18nCodeDescriptor.options()

  changeLocale(locale: I18nCode) {
    this.$app.setLocale(locale)
  }
  locale() {
    return this.$app.getLocale()
  }
}
