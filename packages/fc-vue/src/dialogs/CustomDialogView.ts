import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'
import { DialogProtocol } from './DialogUtils'

@Component({
  template: `
    <el-dialog
      :custom-class="customClass"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :close-on-click-modal="closeOnClickModal"
      @close="$el.remove()"
    >
      <div class="mb-3" style="font-size: 16px; line-height: 1.6">
        <slot />
      </div>
      <div slot="footer" class="dialog-footer">
        <slot name="footer" />
      </div>
    </el-dialog>
  `,
})
export class CustomDialogView extends ViewController implements DialogProtocol {
  @Prop({ default: true, type: Boolean }) readonly closeOnClickModal!: boolean
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '40%', type: String }) readonly width!: string
  @Prop({ default: '', type: String }) readonly customClass!: string

  visible = true

  constructor() {
    super()
  }

  dismiss() {
    this.visible = false
  }
}
