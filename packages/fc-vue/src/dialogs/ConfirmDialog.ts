import { Component } from 'vue-property-decorator'
import { TypicalDialogView } from './TypicalDialogView'
import { TypicalDialog } from './TypicalDialog'
import { i18n } from '../i18n'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" :callback="callback">
      <div v-html="content"></div>
      <el-form v-if="forceVerify" class="mt-2" size="small" @submit.native.prevent="onClickConform">
        <small style="color: red; font-weight: bold;">
          * 本操作存在风险，为避免误操作，请输入验证信息: {{ randomText }}
        </small>
        <el-form-item>
          <el-input v-model="verifyText" placeholder="请输入验证信息" />
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class ConfirmDialog extends TypicalDialog {
  content: string = ''
  forceVerify: boolean = false
  randomText: string = ''
  verifyText: string = ''
  placeholder: string = ''
  title = i18n.t('Please Confirm') as string

  constructor() {
    super()
  }

  onClickConform() {
    if (this.dialogView()) {
      this.dialogView().onClickConfirm()
    }
  }

  public static strongDialog() {
    const dialog = new ConfirmDialog()
    dialog.forceVerify = true
    dialog.randomText = `${1000 + Math.floor(Math.random() * 9000)}`
    return dialog
  }

  onHandleResult() {
    if (this.forceVerify && this.randomText !== this.verifyText) {
      this.$message.error('验证失败，请重新输入验证信息')
      throw new Error('验证失败，请重新输入验证信息')
    }
  }
}
