import { Component } from 'vue-property-decorator'
import { CustomDialogView } from './CustomDialogView'
import { CustomDialog } from './CustomDialog'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
  },
  template: `
    <custom-dialog-view :title="title" width="80%">
      <img width="100%" :src="imgSrc" />
    </custom-dialog-view>
  `,
})
export class ImagePreviewDialog extends CustomDialog {
  title: string = 'Image Preview'
  imgSrc: string = ''

  constructor() {
    super()
  }

  static show(imgSrc: string) {
    const dialog = new ImagePreviewDialog()
    dialog.imgSrc = imgSrc
    dialog.show()
  }
}
