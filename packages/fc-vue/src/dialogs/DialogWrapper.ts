import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'
import { DialogProtocol } from './DialogUtils'

/**
 * @deprecated
 */
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
      <div v-if="showFooter" slot="footer" class="dialog-footer">
        <el-button size="small" @click="onClickCancel">{{ LS('Cancel') }}</el-button>
        <el-button v-loading="isBusy" size="small" type="primary" :disabled="isBusy" @click="onClickConfirm">
          <template v-if="confirmBtnText">
            {{ confirmBtnText }}
          </template>
          <template v-else>
            {{ LS('Confirm') }}
          </template>
        </el-button>
      </div>
    </el-dialog>
  `,
})
export class DialogWrapper extends ViewController implements DialogProtocol {
  @Prop({ default: false, type: Boolean }) readonly isBusy!: boolean
  @Prop({ default: false, type: Boolean }) readonly showFooter!: boolean
  @Prop({ default: true, type: Boolean }) readonly closeOnClickModal!: boolean
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '40%', type: String }) readonly width!: string
  @Prop({ default: '', type: String }) readonly confirmBtnText!: string
  @Prop({ default: '', type: String }) readonly customClass!: string

  visible = true

  constructor() {
    super()
  }

  onClickConfirm() {
    this.$emit('on-confirm', this)
  }

  onClickCancel() {
    this.$emit('on-cancel', this)
    this.dismiss()
  }

  dismiss() {
    this.visible = false
  }
}
