import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { SelectOption } from '@fangcha/tools'
import { ViewController } from '../ViewController'
import '../plugins/element-ui-plugin'

@Component({
  template: `
    <el-select v-model="myValue" multiple :size="size" :filterable="filterable" @change="onDataChanged">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  `,
})
export class StrMultiplePicker extends ViewController {
  @Model('update:value', { type: String, default: '' }) readonly value!: string
  @Prop({ type: String }) readonly size?: string
  @Prop({ default: false, type: Boolean }) readonly filterable?: boolean
  @Prop({ default: false, type: Boolean }) readonly pickNumber?: boolean
  @Prop({ default: () => [], type: Array }) readonly options!: SelectOption[]

  myValue: (string | number)[] = []

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    val = val || ''
    this.myValue = val
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
      .map((item) => {
        return this.pickNumber ? Number(item) : item
      })
  }

  onDataChanged() {
    const value = this.myValue.map((item) => `${item}`).join(',')
    this.$emit('update:value', value)
    this.$emit('change', value)
  }
}
