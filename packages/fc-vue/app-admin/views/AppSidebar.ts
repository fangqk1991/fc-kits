import { Component, ViewController } from '../../src'
import { AppMenu } from './AppMenu'

@Component({
  components: {
    'app-menu': AppMenu,
  },
  template: `
    <el-aside class="app-sidebar" :width="width">
      <app-menu :collapse="collapse" :unique-opened="uniqueOpened" />
      <div class="toggle" @click="toggleCollapse">
        <i v-if="collapse" class="el-icon-arrow-right" />
        <i v-else class="el-icon-arrow-left" />
      </div>
    </el-aside>
  `,
})
export class AppSidebar extends ViewController {
  collapse = false

  get width() {
    return this.collapse ? '64px' : '220px'
  }

  get uniqueOpened() {
    return this.$app.config.sidebarUniqueOpened || false
  }

  toggleCollapse() {
    this.collapse = !this.collapse
  }
}
