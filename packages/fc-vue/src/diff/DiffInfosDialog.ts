import { Component } from 'vue-property-decorator'
import { DiffEntity } from '@fangcha/tools'
import { CustomDialog, CustomDialogView } from '../dialogs'
import { DiffTableView } from './DiffTableView'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
    'diff-table-view': DiffTableView,
  },
  template: `
    <custom-dialog-view :title="title" width="60%" :callback="callback">
      <diff-table-view :diff-items="diffItems" />
    </custom-dialog-view>
  `,
})
export class DiffInfosDialog extends CustomDialog {
  diffItems: DiffEntity[] = []

  constructor() {
    super()
  }

  static dialog(diffItems: DiffEntity[]) {
    const dialog = new DiffInfosDialog()
    dialog.title = '查看差异'
    dialog.diffItems = diffItems
    return dialog
  }
}
