import { Component, Model, Watch } from 'vue-property-decorator'
import { MySelect } from './MySelect'
import { ViewController } from '../ViewController'

@Component({
  components: {
    'my-select': MySelect,
  },
  template: `
    <my-select v-model="myValue" @change="onDataChanged">
      <option value="">{{ title }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </my-select>
  `,
})
export class FilterSelector extends ViewController {
  @Model('update:value', { type: [String, Number], default: '' }) readonly value!: string | number

  myValue: string = ''

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  viewDidLoad() {}

  onDataChanged() {
    this.$emit('update:value', this.myValue)
    this.$emit('change', this.myValue)
  }

  get title() {
    return ''
  }

  get options() {
    return []
  }
}
