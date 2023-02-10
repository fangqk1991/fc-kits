import { Component, MySelect, MyTableView, TableViewProtocol, ViewController } from '../../src'
import { DemoRecord, FakeServer } from './FakeServer'
import DemoRecordDialog from './DemoRecordDialog'

@Component({
  components: {
    'my-table-view': MyTableView,
    'my-select': MySelect,
  },
  template: `
    <div>
      <h2>TableView Demo</h2>
      <el-form class="mt-2" label-position="top" :inline="true" size="mini" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建记录</el-button>
        </el-form-item>
      </el-form>
      <my-table-view ref="tableView" :delegate="delegate">
        <el-table-column prop="index" label="序号" />
        <el-table-column>
          <template v-slot:header>
            <my-select v-model="filterParams['level']" @change="onFilterUpdate">
              <option value="">选择区间</option>
              <option value="Low">区间 (-∞, 0.5)</option>
              <option value="High">区间 [0.5, ∞)</option>
            </my-select>
          </template>
          <template slot-scope="scope">
            {{ scope.row.value }}<br />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a href="javascript:" @click="onEditItem(scope.row)">编辑</a> | 
            <a href="javascript:" @click="onDeleteItem(scope.row)">删除</a>
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export class TableDemoView extends ViewController {
  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      level: query['level'] || '',
    }
  }

  async viewDidLoad() {
    this.tableView().resetFilter(true)
  }

  onFilterUpdate() {
    this.tableView().onFilterUpdate()
  }

  onClickCreate() {
    const dialog = DemoRecordDialog.dialogForCreate()
    dialog.show(async (params: { value: number | string }) => {
      FakeServer.createRecord(params)
      this.$message.success('创建成功')
      this.tableView().reloadData()
    })
  }

  onEditItem(item: DemoRecord) {
    const dialog = DemoRecordDialog.dialogForEdit(item)
    dialog.show(async (params: { value: number | string }) => {
      FakeServer.updateRecord(item.index, params)
      this.$message.success('更新成功')
      this.tableView().reloadData()
    })
  }

  onDeleteItem(item: DemoRecord) {
    FakeServer.deleteRecord(item)
    this.$message.success('删除成功')
    this.tableView().reloadData()
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
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          level: this.filterParams['level'],
        }
        return FakeServer.requestPageData(params)
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }
}
