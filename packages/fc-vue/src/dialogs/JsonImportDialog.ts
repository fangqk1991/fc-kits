import { Component } from 'vue-property-decorator'
import { TypicalDialog, TypicalDialogView } from '.'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view :title="title" width="60%" :callback="callback" :close-on-click-modal="false">
      <el-form class="my-mini-form" size="mini" label-position="top">
        <el-form-item>
          <ul>
            <li>提交的 JSON 文本必须为标准格式</li>
            <li>通用为某一模型的导出内容</li>
            <li v-if="description" class="text-danger">{{ description }}</li>
          </ul>
        </el-form-item>
        <el-form-item label="请贴入完整 JSON 内容">
          <el-input v-model="dataContent" size="mini" type="textarea" rows="12"> </el-input>
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class JsonImportDialog<T = any> extends TypicalDialog<T> {
  description: string = ''
  dataContent: string = ''

  constructor() {
    super()
  }

  async viewDidLoad() {}

  static dialog<T = any>() {
    const dialog = new JsonImportDialog<T>()
    dialog.title = `导入`
    return dialog
  }

  async onHandleResult() {
    return JSON.parse(this.dataContent)
  }
}
