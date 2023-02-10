import { Vue, Component, Model, Watch } from 'vue-property-decorator'
import '../assets/my-select.css'

@Component({
  template: `
    <select
      v-model="myValue"
      title="source"
      class="my-select"
      @change="onSelectChange"
      @click="(e) => e.stopPropagation()"
    >
      <slot />
    </select>
  `,
})
export class MySelect extends Vue {
  @Model('update:value', { default: null }) readonly value!: string | number

  myValue: string | number = ''

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  mounted() {
    this.myValue = this.value || ''
  }

  onSelectChange() {
    this.$emit('update:value', this.myValue)
    this.$emit('change', this.myValue)
  }
}
