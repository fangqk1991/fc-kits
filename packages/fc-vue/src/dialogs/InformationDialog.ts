import { Component } from 'vue-property-decorator'
import { CustomDialogView } from './CustomDialogView'
import { CustomDialog } from './CustomDialog'
import { InfoCell, SimpleInfoTable } from '../tables'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
    'simple-info-table': SimpleInfoTable,
  },
  template: `
    <custom-dialog-view :title="title">
      <simple-info-table :cells="cells" />
    </custom-dialog-view>
  `,
})
export class InformationDialog extends CustomDialog {
  title: string = 'Info'
  cells: InfoCell[] = []

  constructor() {
    super()
  }

  static show(title: string, cells: InfoCell[]) {
    const dialog = new InformationDialog()
    dialog.title = title
    dialog.cells = cells
    dialog.show()
  }
}
