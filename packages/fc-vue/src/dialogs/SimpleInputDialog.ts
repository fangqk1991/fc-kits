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
      <el-form label-width="100px" @submit.native.prevent="onConfirm">
        <el-input v-model="content" :placeholder="placeholder" :type="type"></el-input>
      </el-form>
      <p v-if="description">{{ description }}</p>
    </typical-dialog-view>
  `,
})
export class SimpleInputDialog extends TypicalDialog {
  title: string = i18n.t('Please Input') as string
  content: string | number = ''
  placeholder: string = ''
  description = ''
  type: string = 'text'

  constructor() {
    super()
  }

  static textInputDialog() {
    return new SimpleInputDialog()
  }

  static textareaDialog() {
    const dialog = new SimpleInputDialog()
    dialog.type = 'textarea'
    return dialog
  }

  static numberInputDialog() {
    const dialog = new SimpleInputDialog()
    dialog.type = 'number'
    return dialog
  }

  onHandleResult() {
    return this.content
  }
}
