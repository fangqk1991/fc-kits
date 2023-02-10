import { Component, ViewController } from '../../src'
import { AppMenu } from './AppMenu'

@Component({
  components: {
    'app-menu': AppMenu,
  },
  template: `
    <div class="app-dropdown-menu mr-3" @mouseleave="hover = false">
      <span class="dropdown-icon">
        <i class="el-icon-menu cursor-pointer" @mouseover="hover = true"></i>
      </span>
      <app-menu v-show="hover" />
    </div>
  `,
})
export class AppDropdownMenu extends ViewController {
  hover = false
  viewDidLoad() {}
}
