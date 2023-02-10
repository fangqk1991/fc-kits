import { Component, MyTableView, TableViewProtocol, ViewController } from '../../src'
import { DemoRecord, FakeServer } from './FakeServer'
import DemoRecordDialog from './DemoRecordDialog'
import { GridView } from '../../src'

@Component({
  components: {
    'grid-view': GridView,
  },
  template: `
    <div>
      <h2>GridView Demo</h2>
      <el-form class="mt-2" label-position="top" :inline="true" size="mini" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onClickCreate">创建记录</el-button>
        </el-form-item>
      </el-form>
      <grid-view ref="tableView" :delegate="delegate">
        <el-tag slot-scope="scope" class="mr-2">
          {{ scope.data.index }}. {{ scope.data.value }}
        </el-tag>
      </grid-view>
    </div>
  `,
})
export class GridDemoView extends ViewController {
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
