import { Component, Prop, ViewController } from '../index'
import { SelectOption } from '@fangcha/tools'

@Component({
  template: `
    <div>
      <h4 v-if="title">{{ title }}</h4>
      <el-table :data="options" size="mini" border :header-cell-style="{ 'background-color': '#fafafa' }">
        <template slot="empty">
          <el-button style="color: #4E5BBD; border-color: #4E5BBD;" :disabled="readonly" size="mini" @click="addEnumOption">
            {{ LS('Add') }}
          </el-button>
        </template>
        <el-table-column label="选项标识符">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" type="text" size="small" :disabled="readonly" />
          </template>
        </el-table-column>
        <el-table-column label="展示名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label" size="small" :disabled="readonly" />
          </template>
        </el-table-column>
        <el-table-column v-if="!readonly" width="120px" align="center">
          <template slot="header">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button class="el-icon-plus action-icon" @click="addEnumOption(scope.$index)" />
            <el-button class="el-icon-delete action-icon" @click="removeEnumOption(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  `,
})
export class OptionsEditor extends ViewController {
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: false, type: Boolean }) readonly readonly!: boolean
  @Prop({
    default: () => {
      return []
    },
    type: Array,
  })
  readonly options!: SelectOption[]

  removeEnumOption(index: number) {
    this.options.splice(index, 1)
  }

  addEnumOption(index: number = -1) {
    const nextItem: SelectOption = {
      label: '',
      value: '',
    }
    if (index >= 0) {
      this.options.splice(index + 1, 0, nextItem)
    } else {
      this.options.push(nextItem)
    }
  }
}
