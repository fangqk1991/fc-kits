import { Component } from 'vue-property-decorator'
import { TypicalDialog, TypicalDialogView } from '../../src/dialogs'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" width="40%" :callback="callback" :cancel-callback="cancelCallback">
      Demo
    </typical-dialog-view>
  `,
})
export class TypicalDemoDialog extends TypicalDialog<string> {
  title: string = 'TypicalDialog Demo'

  constructor() {
    super()
  }

  onHandleResult() {
    return 'OK'
  }
}
