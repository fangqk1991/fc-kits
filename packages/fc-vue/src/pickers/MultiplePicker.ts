import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { SelectOption } from '@fangcha/tools'
import { ViewController } from '../ViewController'
import '../plugins/element-ui-plugin'
import { getStrEllipsis } from '@fangcha/tools'

@Component({
  template: `
    <el-select v-model="myValue" multiple :size="size" :filterable="filterable" @change="onDataChanged">
      <el-option v-for="item in options" :key="item.value" :label="getItemLabel(item)" :value="item.value" />
    </el-select>
  `,
})
export class MultiplePicker extends ViewController {
  @Model('update:value', { type: Array, default: () => [] }) readonly value!: (string | number)[]
  @Prop({ type: String }) readonly size?: string
  @Prop({ default: false, type: Boolean }) readonly filterable?: boolean
  @Prop({ default: () => [], type: Array }) readonly options!: SelectOption[]

  myValue: (string | number)[] = []

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: any) {
    this.myValue = val
  }

  onDataChanged() {
    this.$emit('update:value', this.myValue)
    this.$emit('change', this.myValue)
  }

  getItemLabel(item: SelectOption) {
    return getStrEllipsis(item.label, 70)
  }
}
