import { Component, Model, Watch, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

@Component({
  template: `
    <el-switch v-model="myValue" :disabled="!!disabled" @change="onSwitchChange" />
  `,
})
export class MySwitch extends ViewController {
  @Model('update:value', { default: false }) readonly value!: boolean | number
  @Prop({ default: false, type: [Boolean, Number] }) readonly disabled!: boolean | number

  myValue: boolean = false

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: boolean | number) {
    this.myValue = !!val
  }

  mounted() {
    this.onValueChanged(this.value)
  }

  onSwitchChange() {
    let targetValue: any = this.myValue
    if (typeof this.value === 'number') {
      targetValue = this.myValue ? 1 : 0
    }
    this.$emit('update:value', targetValue)
    this.$emit('change', targetValue)
  }
}
