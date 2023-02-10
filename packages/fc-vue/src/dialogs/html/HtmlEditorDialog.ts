import { Component } from 'vue-property-decorator'
import { TypicalDialogView } from '../TypicalDialogView'
import { TypicalDialog } from '../TypicalDialog'
import { CodeEditor } from '../../widgets'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'code-editor': CodeEditor,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" width="80%" :callback="callback">
      <el-row :gutter="20" style="height: 60vh">
        <el-col :span="12" style="height: 100%;">
          <code-editor v-model="htmlContent" class="fc-prefect-editor" />
        </el-col>
        <el-col :span="12" style="height: 100%;">
          <iframe width="100%" height="100%" :srcdoc="htmlContent" style="border: none;" />
        </el-col>
      </el-row>
    </typical-dialog-view>
  `,
})
export class HtmlEditorDialog extends TypicalDialog<string> {
  title: string = 'HTML Editor'
  htmlContent: string = ''

  constructor() {
    super()
  }

  onHandleResult() {
    return this.htmlContent
  }

  static dialogForEdit(htmlContent: string) {
    const dialog = new HtmlEditorDialog()
    dialog.htmlContent = htmlContent
    return dialog
  }
}
