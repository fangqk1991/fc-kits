import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { SuggestionProtocol } from './SuggestionProtocol'
import { ViewController } from '../ViewController'

@Component({
  template: `
    <el-select
      v-model="myValue"
      filterable
      clearable
      remote
      :placeholder="protocol.placeholder"
      :remote-method="reloadItems"
      :loading="isLoading"
      :disabled="disabled"
      :size="size"
      @change="handleSelect"
    >
      <el-option 
        v-for="item in items" 
        :key="item[protocol.valueKey]" 
        :label="protocol.describeLabel(item)" 
        :value="item[protocol.valueKey]"
      />
    </el-select>
  `,
})
export class SuggestionSelector<T = any> extends ViewController {
  get protocol(): SuggestionProtocol<T> {
    throw new Error(`SuggestionProtocol Error`)
  }

  @Prop({ default: 'mini', type: String }) readonly size!: string
  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean

  @Model('update:value', { default: null }) readonly value!: string
  myValue: string = ''

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  constructor() {
    super()
  }

  items: T[] = []

  viewDidLoad() {
    this.reloadItems('')
  }

  async reloadItems(keywords: string) {
    this.execHandler(async () => {
      this.items = await this.protocol.loadData(keywords)
    })
  }

  handleSelect() {
    this.$emit('update:value', this.myValue)
    const item = this.items.find((item) => item[this.protocol.valueKey as any] === this.myValue) || null
    this.$emit('change', this.myValue, item)
  }
}
