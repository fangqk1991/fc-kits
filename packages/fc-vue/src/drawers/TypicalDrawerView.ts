import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'
import './drawer.scss'

@Component({
  template: `
    <el-drawer
      class="my-drawer"
      :title="title"
      :visible.sync="visible"
      :size="size"
      @closed="$el.remove()">
      <slot />
    </el-drawer>
  `,
})
export class TypicalDrawerView extends ViewController {
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '40%', type: String }) readonly size!: string

  visible = true

  viewDidLoad() {}

  constructor() {
    super()
  }

  dismiss() {
    this.visible = false
  }
}
