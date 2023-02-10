import { Component } from 'vue-property-decorator'
import { CustomDialogView } from '../CustomDialogView'
import { CustomDialog } from '../CustomDialog'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
  },
  template: `
    <custom-dialog-view :title="title" width="80%">
      <div style="height: 60vh">
        <iframe width="100%" height="100%" :srcdoc="htmlContent" />
      </div>
    </custom-dialog-view>
  `,
})
export class HtmlPreviewDialog extends CustomDialog {
  title: string = 'HTML Preview'
  htmlContent: string = ''

  constructor() {
    super()
  }

  static previewHTML(htmlContent: string) {
    const dialog = new HtmlPreviewDialog()
    dialog.htmlContent = htmlContent
    dialog.show()
  }
}
