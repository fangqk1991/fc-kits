import { Component } from 'vue-property-decorator'
import { AccountSimpleParams } from '@fangcha/account/lib/common/models'
import { TypicalDialog, TypicalDialogView } from '../../src/dialogs'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view :title="title" width="60%" :callback="callback">
      <el-form class="fc-typical-form" size="mini" label-width="120px">
        <el-form-item label="Email" :required="true">
          <el-input v-model="data.email" type="text" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="Password" :required="true">
          <el-input v-model="data.password" type="password" style="width: 100%;" />
        </el-form-item>
      </el-form>
    </typical-dialog-view>
  `,
})
export class AccountCreateDialog extends TypicalDialog<AccountSimpleParams> {
  data: AccountSimpleParams = {
    email: '',
    password: '',
  }

  constructor() {
    super()
  }

  static dialogForCreate() {
    const dialog = new AccountCreateDialog()
    dialog.title = '创建账号'
    return dialog
  }

  onHandleResult() {
    return this.data
  }
}
