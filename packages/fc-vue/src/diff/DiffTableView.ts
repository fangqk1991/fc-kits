import { DiffEntity, DiffType } from '@fangcha/tools'
import { ViewController } from '../ViewController'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  template: `
    <el-table :data="diffItems" border stripe class="mb-4" size="small">
      <el-table-column :label="LS('Action')" width="60px">
        <template slot-scope="scope">
          <span v-if="scope.row.type === DiffType.Created" style="color: #67c23a;">{{ LS('Create') }}</span>
          <span v-if="scope.row.type === DiffType.Updated" style="color: #e6a23c;">{{ LS('Update') }}</span>
          <span v-if="scope.row.type === DiffType.Deleted" style="color: #f56c6c;">{{ LS('Remove') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="LS('Changed Item')">
        <template slot-scope="scope">
          <del v-if="scope.row.type === DiffType.Deleted">
            {{ describeDiffItem(scope.row) }}
          </del>
          <span v-else>
            {{ describeDiffItem(scope.row) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="LS('Description')">
        <template slot-scope="scope">
          <template v-if="descriptionFunc && descriptionFunc(scope.row)">
            {{ descriptionFunc(scope.row) }}
          </template>
          <template v-else>
            {{ scope.row.from }} -> <b style="color: red;">{{ scope.row.to }}</b>
          </template>
        </template>
      </el-table-column>
    </el-table>
  `,
})
export class DiffTableView extends ViewController {
  @Prop({ default: () => [], type: Array }) readonly diffItems!: DiffEntity[]
  @Prop({ default: null, type: Function }) readonly itemFunc!: (item: DiffEntity) => string
  @Prop({ default: null, type: Function }) readonly descriptionFunc!: (item: DiffEntity) => string

  DiffType = DiffType

  describeDiffItem(data: DiffEntity) {
    if (this.itemFunc) {
      return this.itemFunc(data)
    }
    return data.keychain.join('.')
  }
}
