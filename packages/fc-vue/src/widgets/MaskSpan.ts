import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

@Component({
  template: `
    <div v-if="value && value.length > 0" style="display: inline-block">
      <template v-if="useMask">
        <span>{{ stringMask }}</span>
        <i class="el-icon-unlock" style="cursor: pointer" @click="()=>{useMask=!useMask}"></i>
      </template>
      <template v-else>
        <span>{{ value }}</span>
        <i class="el-icon-lock" style="cursor: pointer" @click="()=>{useMask=!useMask}"></i>
      </template>
    </div>
  `,
})
export class MaskSpan extends ViewController {
  @Prop({ default: '', type: [String, Number] }) readonly value!: string
  @Prop({ default: 4, type: [Number] }) readonly startDisplayLength!: string
  @Prop({ default: 4, type: [Number] }) readonly endDisplayLength!: string
  useMask = true
  get stringMask() {
    if (!this.value) {
      return ''
    }
    const reg = new RegExp(`^(.{${this.startDisplayLength}}).*(.{${this.endDisplayLength}})$`)
    return this.value.replace(reg, '$1****$2')
  }
}
