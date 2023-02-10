import { Component } from 'vue-property-decorator'
import { CustomDialogView } from './CustomDialogView'
import { CustomDialog } from './CustomDialog'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
  },
  template: `
    <custom-dialog-view ref="my-dialog" :title="title" width="80%">
      <el-card class="mt-2">
        <pre class="my-pre">{{ content }}</pre>
      </el-card>
    </custom-dialog-view>
  `,
})
export class TextPreviewDialog extends CustomDialog {
  title = 'Preview'
  content: string = ''

  constructor() {
    super()
  }

  static previewJSON(obj: {}) {
    TextPreviewDialog.previewText(JSON.stringify(obj, null, 2))
  }

  static previewText(content: string) {
    const dialog = new TextPreviewDialog()
    dialog.content = content
    dialog.show()
  }
}
