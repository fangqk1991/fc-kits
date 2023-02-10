import { Component, Prop } from 'vue-property-decorator'
import VueI18n from 'vue-i18n'
import { MyRichTextPanel } from '../widgets'
import { ViewController } from '../ViewController'
import { MaskSpan } from '../widgets/MaskSpan'

export enum InfoCellType {
  mask = 'mask',
  default = 'default',
  html = 'html',
}

export interface InfoCell {
  label: string | VueI18n.TranslateResult
  value: string | number
  htmlValue?: string
  type?: InfoCellType
}

@Component({
  components: {
    'my-rich-text-panel': MyRichTextPanel,
    'mask-span': MaskSpan,
  },
  template: `
    <div>
      <el-table :data="cells" border stripe size="small">
        <el-table-column prop="label" :label="LS('Attribute')" />
        <el-table-column :label="LS('Description')">
          <template slot-scope="scope">
            <my-rich-text-panel v-if="scope.row.htmlValue" :html-content="scope.row.htmlValue"/>
            <mask-span v-else-if='scope.row.type === InfoCellType.mask' :value='scope.row.value'></mask-span>
            <span v-else>
              {{ scope.row.value }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  `,
})
export class SimpleInfoTable extends ViewController {
  @Prop({ default: () => [], type: Array }) readonly cells!: InfoCell[]
  InfoCellType = InfoCellType

  constructor() {
    super()
  }
}
