import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'
import { DialogProtocol } from './DialogUtils'
import './dialog.scss'

@Component({
  template: `
    <el-dialog
      :custom-class="customClass + ' fit-narrow-screen'"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :close-on-click-modal="closeOnClickModal"
      @close="onClose"
    >
      <div class="mb-3" style="font-size: 16px; line-height: 1.6">
        <slot />
      </div>
      <div v-if="showFooter" slot="footer" class="dialog-footer">
        <el-button size="small" @click="onClickCancel">{{ LS('Cancel') }}</el-button>
        <el-button v-loading="isBusy" size="small" type="primary" :disabled="isBusy" @click="onClickConfirm">
          {{ confirmBtnText || LS('Confirm') }}
        </el-button>
      </div>
    </el-dialog>
  `,
})
export class TypicalDialogView extends ViewController implements DialogProtocol {
  @Prop({ default: true, type: Boolean }) readonly showFooter!: boolean
  @Prop({ default: false, type: Boolean }) readonly closeOnClickModal!: boolean
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '40%', type: String }) readonly width!: string
  @Prop({ default: '', type: String }) readonly confirmBtnText!: string
  @Prop({ default: '', type: String }) readonly customClass!: string
  @Prop({ default: null, type: Function }) readonly callback!: () => Promise<void>
  @Prop({ default: null, type: Function }) readonly cancelCallback!: () => void

  visible = true
  isBusy = false

  constructor() {
    super()
  }

  async execExclusiveHandler(handler: () => Promise<any>) {
    this.isBusy = true
    try {
      await handler()
      this.isBusy = false
    } catch (e) {
      this.isBusy = false
      throw e
    }
  }

  closeWithOK = false
  async onClickConfirm() {
    if (this.callback) {
      await this.execExclusiveHandler(this.callback)
    }
    this.closeWithOK = true
    this.dismiss()
  }

  onClickCancel() {
    this.dismiss()
  }

  dismiss() {
    this.visible = false
  }

  onClose() {
    if (!this.closeWithOK && this.cancelCallback) {
      this.cancelCallback()
    }
    this.$el.remove()
  }

  viewDidLoad() {}
}
