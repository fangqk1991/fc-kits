import { Component } from 'vue-property-decorator'
import { CheckOption } from '@fangcha/tools'
import { TypicalDialog } from './TypicalDialog'
import { TypicalDialogView } from './TypicalDialogView'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" :callback="callback">
      <p class="mb-2">
        <el-checkbox v-for="option in options" v-model="checkedMap[option.value]" class="mr-3">
          {{ option.label }}
        </el-checkbox>
      </p>
    </typical-dialog-view>
  `,
})
export class MultiplePickerDialog extends TypicalDialog {
  title: string = '请选择'
  options: CheckOption[] = []
  checkedMap: { [p: string]: boolean } = {}

  constructor() {
    super()
  }

  viewDidLoad() {
    this.options.forEach((option) => {
      this.$set(this.checkedMap, option.value, option.checked)
    })
  }

  static dialogWithOptions(options: CheckOption[]) {
    const dialog = new MultiplePickerDialog()
    dialog.options = options
    return dialog
  }

  static dialogWithValues(values: any[]) {
    const dialog = new MultiplePickerDialog()
    dialog.options = values.map((value) => {
      return {
        label: value,
        value: value,
        checked: false,
      }
    })
    return dialog
  }

  onHandleResult() {
    return this.options
      .filter((option) => {
        return this.checkedMap[option.value]
      })
      .map((option) => option.value)
  }
}
