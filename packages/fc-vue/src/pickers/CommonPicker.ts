import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { SelectOption } from '@fangcha/tools'
import { ViewController } from '../ViewController'
import '../plugins/element-ui-plugin'

@Component({
  template: `
    <el-select v-model="myValue" :size="size" :filterable="filterable" @change="onDataChanged">
      <el-option key="" :label="firstTitle" value="" />
      <template v-if="useI18n">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </template>
      <template v-else>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </template>
    </el-select>
  `,
})
export class CommonPicker extends ViewController {
  @Model('update:value', { type: String, default: '' }) readonly value!: string
  @Prop({ type: String }) readonly size?: string
  @Prop({ default: false, type: Boolean }) readonly filterable?: boolean
  @Prop({ default: true, type: Boolean }) readonly useI18n?: boolean
  @Prop({ default: () => [], type: Array }) readonly options!: SelectOption[]
  @Prop({ type: String, default: null }) readonly emptyTitle?: string

  get firstTitle() {
    if (this.emptyTitle === null) {
      return this.LS('ALL')
    }
    return this.emptyTitle
  }

  myValue: string = ''

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  onDataChanged() {
    this.$emit('update:value', this.myValue)
    this.$emit('change', this.myValue)
  }
}
