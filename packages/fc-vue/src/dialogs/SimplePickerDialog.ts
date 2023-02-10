import { Component } from 'vue-property-decorator'
import { SelectOption } from '@fangcha/tools'
import { TypicalDialog } from './TypicalDialog'
import { TypicalDialogView } from './TypicalDialogView'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" :callback="callback">
      <p class="mb-2">
        <el-select v-model="curValue" style="width: 100%;" :filterable="filterable">
          <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </p>
      <p v-if="description">{{ description }}</p>
    </typical-dialog-view>
  `,
})
export class SimplePickerDialog extends TypicalDialog {
  title: string = '请选择'
  options: SelectOption[] = []
  curValue: any = ''
  filterable = false
  description = ''
  constructor() {
    super()
  }

  static dialogWithOptions(options: SelectOption[]) {
    const dialog = new SimplePickerDialog()
    dialog.options = options
    return dialog
  }

  static dialogForTinyInt(title?: string) {
    const dialog = SimplePickerDialog.dialogWithOptions([
      {
        label: 'Yes',
        value: 1,
      },
      {
        label: 'No',
        value: 0,
      },
    ])
    if (title) {
      dialog.title = title
    }
    return dialog
  }

  static dialogForBoolean(title?: string) {
    const dialog = SimplePickerDialog.dialogWithOptions([
      {
        label: 'true',
        value: true as any,
      },
      {
        label: 'false',
        value: false as any,
      },
    ])
    if (title) {
      dialog.title = title
    }
    return dialog
  }

  onHandleResult() {
    return this.curValue
  }
}
