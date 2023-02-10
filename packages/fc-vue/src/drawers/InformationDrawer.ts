import { Component } from 'vue-property-decorator'
import { TypicalDrawer } from './TypicalDrawer'
import { TypicalDrawerView } from './TypicalDrawerView'
import { InfoCell, SimpleInfoTable } from '../tables'

@Component({
  components: {
    'typical-drawer-view': TypicalDrawerView,
    'simple-info-table': SimpleInfoTable,
  },
  template: `
    <typical-drawer-view ref="my-drawer" title="Info" size="80%">
      <simple-info-table class="mx-4 mb-4" :cells="cells" />
    </typical-drawer-view>
  `,
})
export class InformationDrawer extends TypicalDrawer {
  cells: InfoCell[] = []

  constructor() {
    super()
  }

  static show(title: string, cells: InfoCell[]) {
    const drawer = new InformationDrawer()
    drawer.title = title
    drawer.cells = cells
    drawer.show()
  }
}
