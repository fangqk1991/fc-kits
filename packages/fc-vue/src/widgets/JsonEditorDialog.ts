import { TypicalDialog, TypicalDialogView } from '../dialogs'
import { Component } from 'vue-property-decorator'
import { JsonPre } from './JsonPre'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
    'json-pre': JsonPre,
  },
  template: `
    <typical-dialog-view :title="title" width="70%" :callback="callback">
      <div>
        <el-input v-model="dataStr" :rows="rows" type="textarea"></el-input>
      </div>
      <div class="mt-2">
        <el-button type="primary" size="mini" @click="checkValid">格式化校验</el-button>
      </div>
    </typical-dialog-view>
  `,
})
export class JsonEditorDialog extends TypicalDialog {
  data = {}
  dataStr = ''
  rows = 10

  constructor() {
    super()
  }

  viewDidLoad() {
    this.dataStr = JSON.stringify(this.data, null, 2)
  }

  static dialogForEdit<T = {}>(data: T) {
    const dialog = new JsonEditorDialog()
    dialog.title = '编辑'
    dialog.data = JSON.parse(JSON.stringify(data))
    return dialog
  }

  async onHandleResult() {
    this.checkValid()
    return this.data
  }

  checkValid() {
    try {
      this.data = JSON.parse(this.dataStr)
      this.dataStr = JSON.stringify(this.data, null, 2)
    } catch (e) {
      this.$message.error(`JSON 格式有误`)
      throw e
    }
  }
}
