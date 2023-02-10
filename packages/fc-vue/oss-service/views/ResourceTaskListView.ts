import { Component, MySelect, MyTableView, TableViewProtocol, ViewController } from '../../src'
import { CommonAPI } from '@fangcha/app-request'
import { MyAxios } from '../../basic'
import { DownloadApis } from '@fangcha/oss-service/lib/common/apis'
import { ResourceTaskModel, ResourceTaskStatus } from '@fangcha/oss-service/lib/common/models'

@Component({
  components: {
    'my-select': MySelect,
    'my-table-view': MyTableView,
  },
  template: `
    <div>
      <h2>{{ LS('[i18n.oss] My Downloads') }}</h2>
      <my-table-view ref="tableView" :delegate="delegate">
        <el-table-column :label="LS('[i18n.oss] Export Time')">
          <template slot-scope="scope">
            {{ scope.row.createTime | ISO8601 }}
          </template>
        </el-table-column>
        <el-table-column :label="LS('[i18n.oss] File Name')" prop="fileName" />
        <el-table-column :label="LS('[i18n.oss] File Size')">
          <template slot-scope="scope">
            <span v-if="scope.row.size">{{ scope.row.size | size_format }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="LS('Status')" prop="taskStatus" />
        <el-table-column :label="LS('Action')">
          <template slot-scope="scope">
            <template v-if="scope.row.taskStatus === ResourceTaskStatus.Processing">
              <span>{{ LS('[i18n.oss] File Generating') }} {{ scope.row.current }} / {{ scope.row.total }}</span>
            </template>
            <template v-if="scope.row.taskStatus === ResourceTaskStatus.Fail">
              <span>{{ LS('[i18n.oss] Generate Fail') }}</span>
              |
              <a href="javascript:" @click="retryDownload(scope.row)">{{ LS('Retry') }}</a>
            </template>
            <a v-if="scope.row.taskStatus === ResourceTaskStatus.Success" :href="scope.row.downloadUrl" target="_blank">
              {{ LS('Download') }}
            </a>
          </template>
        </el-table-column>
      </my-table-view>
    </div>
  `,
})
export class ResourceTaskListView extends ViewController {
  ResourceTaskStatus = ResourceTaskStatus
  filterParams: any = this.initFilterParams(true)

  initFilterParams(useQuery = false) {
    const query = useQuery ? this.$route.query : {}
    return {
      _: query['_'] || '',
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
      loadData: async (retainParams) => {
        const params: any = {
          ...retainParams,
          ...this.filterParams,
        }
        const request = MyAxios(new CommonAPI(DownloadApis.ResourceTaskPageDataGet))
        request.setQueryParams(params)
        return request.quickSend()
      },
      reactiveQueryParams: (retainQueryParams) => {
        return Object.assign({}, retainQueryParams, this.filterParams)
      },
    }
  }

  async retryDownload(data: ResourceTaskModel) {
    const request = MyAxios(new CommonAPI(DownloadApis.ResourceTaskRetry, data.taskKey))
    await request.quickSend()
    this.$message.success(this.LS('[i18n.oss] Retry Submitted') as string)
    this.tableView().reloadData()
  }
}
