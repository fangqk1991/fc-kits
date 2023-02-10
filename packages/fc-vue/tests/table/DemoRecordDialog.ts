import { Component } from 'vue-property-decorator'
import { TypicalDialog, TypicalDialogView } from '../../src'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view :title="title" width="40%" :callback="callback">
      <el-form size="mini" label-width="80px">
        <el-form-item label="数值" :required="true" class="my-form-item">
          <el-input v-model="data.value" type="number" style="width: 100%;"> </el-input>
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export default class DemoRecordDialog extends TypicalDialog {
  data: any = {
    value: '',
  }
  forEditing = false

  constructor() {
    super()
  }

  static dialogForCreate() {
    const dialog = new DemoRecordDialog()
    dialog.title = '创建记录'
    return dialog
  }

  static dialogForEdit(data: any) {
    const dialog = new DemoRecordDialog()
    dialog.title = '编辑记录'
    dialog.forEditing = true
    dialog.data = Object.assign({}, data)
    return dialog
  }

  onHandleResult() {
    return this.data
  }
}
