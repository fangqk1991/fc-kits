import { CommonAPI } from '@fangcha/app-request'
import { CarrierType, FullAccountModel } from '@fangcha/account/lib/common/models'
import { AdminAccountApis } from '@fangcha/account/lib/common/admin-api'
import { MyTableView, TableViewProtocol } from '../../src/tables'
import { Component } from 'vue-property-decorator'
import { ViewController } from '../../src/ViewController'
import { MyAxios } from '../../basic'
import { ConfirmDialog, SimpleInputDialog } from '../../src/dialogs'
import { AccountCreateDialog } from './AccountCreateDialog'

@Component({
  components: {
    'my-table-view': MyTableView,
  },
  template: `
    <div>
      <h2>账号</h2>
      <el-form :inline="true" size="mini" @submit.prevent.native="onFilterUpdate">
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建账号</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="mini" @submit.prevent.native="onFilterUpdate">
        <el-form-item>
          <el-input v-model="filterParams.keywords" clearable placeholder="Keywords" style="width: 330px">
            <template slot="append">
              <el-button size="mini" @click="onFilterUpdate">Search</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <my-table-view ref="tableView" :delegate="delegate">
        <el-table-column prop="name" label="账号">
          <template slot-scope="scope">
            {{ scope.row.accountUid }}<br />
            {{ scope.row.nickName }}
            <el-tag v-if="!scope.row.isEnabled" class="adaptive-tag" type="danger">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Email">
          <template slot-scope="scope">
            {{ scope.row.email }}
            |
            <a class="text-danger" href="javascript:" @click="onUnlinkCarrier(scope.row)">解绑</a>
          </template>
        </el-table-column>
        <el-table-column label="创建时间 / 更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | ISO8601 }}</span>
            <br />
            <span>{{ scope.row.updateTime | ISO8601 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:" @click="onChangeEmail(scope.row)">变更邮箱</a>
            <br />
            <a href="javascript:" @click="onResetPassword(scope.row)">重置密码</a>
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export class AccountListView extends ViewController {
  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      keywords: query['keywords'] || '',
    }
  }

  async viewDidLoad() {
    this.tableView().resetFilter(true)
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
  }

  resetFilter(useQuery = false) {
    this.filterParams = this.initFilterParams(useQuery)
    this.tableView().reloadData()
  }

  tableView() {
    return this.$refs.tableView as MyTableView
  }
  get delegate(): TableViewProtocol {
    return {
      defaultSettings: {
        sortDirection: 'descending',
      },
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          ...this.filterParams,
        }
        const request = MyAxios(new CommonAPI(AdminAccountApis.AccountPageDataGet))
        request.setQueryParams(params)
        return request.quickSend()
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }

  onClickCreate() {
    const dialog = AccountCreateDialog.dialogForCreate()
    dialog.show(async (params) => {
      const request = MyAxios(new CommonAPI(AdminAccountApis.AccountCreate))
      request.setBodyData(params)
      await request.quickSend()
      this.$message.success('创建成功')
      this.tableView().reloadData()
    })
  }

  onResetPassword(item: FullAccountModel) {
    const dialog = SimpleInputDialog.textInputDialog()
    dialog.title = '输入新密码'
    dialog.show(async (newPassword: string) => {
      const request = MyAxios(new CommonAPI(AdminAccountApis.AccountPasswordReset, item.accountUid))
      request.setBodyData({
        newPassword: newPassword
      })
      await request.quickSend()
      this.$message.success('重置成功')
      this.tableView().reloadData()
    })
  }

  onChangeEmail(item: FullAccountModel) {
    const dialog = SimpleInputDialog.textInputDialog()
    dialog.title = '输入新邮箱'
    dialog.show(async (email: string) => {
      const request = MyAxios(new CommonAPI(AdminAccountApis.AccountCarrierUpdate, item.accountUid, CarrierType.Email))
      request.setBodyData({
        carrierUid: email
      })
      await request.quickSend()
      this.$message.success('变更成功')
      this.tableView().reloadData()
    })
  }

  onUnlinkCarrier(item: FullAccountModel) {
    const dialog = ConfirmDialog.strongDialog()
    dialog.title = `请确认`
    dialog.content = `确定解绑此账号 Email[${item.email}] 吗`
    dialog.show(async () => {
      const request = MyAxios(new CommonAPI(AdminAccountApis.AccountCarrierUnlink, item.accountUid, CarrierType.Email))
      await request.quickSend()
      this.$message.success('删除成功')
      this.tableView().reloadData()
    })
  }
}
