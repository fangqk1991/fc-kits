import { Component } from 'vue-property-decorator'
import { ViewController } from '../ViewController'
import { TypicalDrawerView } from './TypicalDrawerView'

@Component({
  components: {
    'typical-drawer-view': TypicalDrawerView,
  },
  template: `
    <typical-drawer-view :title="title" :size="size">
      <slot />
    </typical-drawer-view>
  `,
})
export class TypicalDrawer extends ViewController {
  title = ''
  size = '40%'

  viewDidLoad() {}
  viewDidAppear() {}

  constructor() {
    super()
  }

  private loadView() {
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    this.$mount(dom)
    this.$nextTick(() => {
      this.viewDidAppear()
    })
  }

  show() {
    this.loadView()
  }
}
