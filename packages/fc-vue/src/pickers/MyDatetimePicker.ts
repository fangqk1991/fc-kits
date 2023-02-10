import { Vue, Component, Model, Watch, Prop } from 'vue-property-decorator'
import * as moment from 'moment'

@Component({
  template: `
    <el-date-picker
      v-model="myValue"
      type="datetime"
      @change="onSelectChange"
      :picker-options="pickerOptions"
      :disabled="disabled"
    >
    </el-date-picker>
  `,
})
export class MyDatetimePicker extends Vue {
  @Model('update:value', { default: null }) readonly value!: string
  @Prop({
    default: () => {
      return {}
    },
    type: Object,
  })
  readonly pickerOptions!: {}
  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean

  myValue: Date | null = null

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    if (val) {
      const time = moment(val)
      this.myValue = time.isValid() ? time.toDate() : null
    } else {
      this.myValue = null
    }
  }

  mounted() {
    this.onValueChanged(this.value)
  }

  onSelectChange() {
    this.$emit('update:value', this.myValue ? moment(this.myValue as Date).format() : '')
    this.$emit('change', this.value)
  }
}
