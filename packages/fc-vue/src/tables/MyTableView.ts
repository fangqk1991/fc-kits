import { Component, Prop } from 'vue-property-decorator'
import { MyPagination, PageInfo } from './MyPagination'
import { ViewController } from '../ViewController'
import '../plugins/vue-router-plugin'
import '../plugins/element-ui-plugin'
import { DiffMapper, PageResult } from '@fangcha/tools'
import { ElTable } from 'element-ui/types/table'

interface PageData {
  totalSize: number
  elements: any[]
}

interface OrderRule {
  prop: string
  order: 'ascending' | 'descending'
}

interface RetainParams {
  _offset: number
  _length: number
  _sortKey: string
  _sortDirection: string
}

interface DefaultSettings {
  pageNumber?: number
  pageSize?: number
  sortKey?: string
  sortDirection?: 'ascending' | 'descending'
}

export interface TableViewProtocol<T = any> {
  defaultSettings?: DefaultSettings | (() => DefaultSettings)
  reactiveQueryParams?: (retainQueryParams: DefaultSettings) => { [p: string]: any }
  onDataChanged?: (feeds: any[]) => void
  loadData?: (retainParams: Partial<RetainParams>) => Promise<PageData | PageResult<T>>
  loadOnePageItems?: (retainParams: Partial<RetainParams>) => Promise<T[]>
}

const trimParams = (params: {}) => {
  params = params || {}
  const newParams = {}
  Object.keys(params)
    .filter((key) => {
      return params[key] !== ''
    })
    .forEach((key) => {
      newParams[key] = params[key]
    })
  return newParams
}

@Component({
  components: {
    'my-pagination': MyPagination,
  },
  template: `
    <div>
      <slot name="header" />
      <el-table
        ref="elTable"
        v-loading="isLoading"
        :data="tableItems"
        :default-sort="orderRule"
        :row-class-name="rowClassName"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        border
        stripe
        size="small"
        @sort-change="sortChangeHandler"
        @row-click="rowClick"
      >
        <el-table-column
          v-if="selectable"
          type="selection"
          width="55" />
        <slot />
      </el-table>
      <my-pagination v-if="!singlePage && pageInfo.total > tableItems.length" v-model="pageInfo" :layout="pageLayout" :page-sizes="pageSizes" @change="reloadData()" />
      <slot name="footer" />
    </div>
  `,
})
export class MyTableView<T = any> extends ViewController {
  @Prop({ default: '', type: [String, Function] }) readonly rowClassName!: string | Function
  @Prop({ default: null, type: [Object, Function] }) readonly headerCellStyle!: {} | Function | null
  @Prop({ default: null, type: [Object, Function] }) readonly cellStyle!: {} | Function | null
  @Prop({ default: '', type: String }) readonly namespace!: string
  @Prop({ default: null, type: Object }) readonly delegate!: TableViewProtocol
  @Prop({ default: false, type: Boolean }) readonly singlePage!: boolean
  @Prop({ default: false, type: Boolean }) readonly sortInLocal!: boolean
  @Prop({ default: false, type: Boolean }) readonly forOldParams!: boolean
  @Prop({ default: true, type: Boolean }) readonly reactiveQuery!: boolean
  @Prop({ default: () => [], type: Array }) readonly forbiddenQueryWords!: string[]
  @Prop({ default: () => () => {}, type: Function }) readonly rowClick!: Function
  @Prop({ default: true, type: Boolean }) readonly trimParams!: boolean

  @Prop({ default: 'prev, pager, next', type: String }) readonly pageLayout?: string
  @Prop({ default: null, type: Array }) readonly pageSizes!: number[] | null
  @Prop({ default: false, type: Boolean }) readonly selectable!: boolean

  public isLoading: boolean = false

  tableItems: T[] = []

  getSelectedDataItems() {
    const table = this.$refs['elTable'] as ElTable
    return table['selection'] as T[]
  }

  pageInfo: PageInfo = {
    pageNumber: 1,
    pageSize: 10,
    total: null,
  }

  orderRule: OrderRule = {
    prop: '',
    order: 'descending',
  }

  viewDidLoad() {
    this.makeBasicSettings(true)
  }

  private _sortChangeDispatchFirstTime: boolean = false
  sortChangeHandler(params: OrderRule) {
    if (!this._sortChangeDispatchFirstTime) {
      // defaultSort make the first call
      this._sortChangeDispatchFirstTime = true
      return
    }
    this.orderRule = params

    if (this.sortInLocal) {
      this.updateQuery()
    } else {
      this.onFilterUpdate()
    }
  }

  onFilterUpdate() {
    this.pageInfo.pageNumber = 1
    this.reloadData()
  }

  updateQuery() {
    if (!this.reactiveQuery) {
      return
    }
    const retainQueryParams: DefaultSettings = {
      [this.getTargetKey('pageNumber')]: this.pageInfo.pageNumber,
      [this.getTargetKey('pageSize')]: this.pageInfo.pageSize,
      [this.getTargetKey('sortKey')]: this.orderRule.prop,
      [this.getTargetKey('sortDirection')]: this.orderRule.order,
    }
    const params = this.delegate.reactiveQueryParams
      ? this.delegate.reactiveQueryParams(retainQueryParams)
      : retainQueryParams
    let queryParams = Object.assign({}, this.$route?.query || {})

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined || params[key] !== null) {
        queryParams[key] = params[key]
      }
      if (typeof queryParams[key] === 'number') {
        queryParams[key] = `${queryParams[key]}`
      }
    })

    if (this.trimParams) {
      queryParams = trimParams(queryParams)
    }

    for (const queryKey of Object.keys(queryParams)) {
      for (const forbiddenWord of this.forbiddenQueryWords) {
        if (typeof queryParams[queryKey] === 'string' && queryParams[queryKey].includes(forbiddenWord)) {
          delete queryParams[queryKey]
          break
        }
      }
    }
    const defaultSettings = this.getDefaultSettings()
    for (const key of ['pageNumber', 'pageSize', 'sortKey', 'sortDirection']) {
      if (queryParams[key] === `${defaultSettings[key]}`) {
        delete queryParams[key]
      }
    }
    if (this.$route && !DiffMapper.checkEquals(this.$route.query, queryParams)) {
      this.$router.replace({
        path: this.$route.path,
        query: queryParams,
      })
    }
  }

  private _oldRetainParams() {
    const params = {
      sortProp: this.orderRule.prop || '',
      sortType: this.orderRule.order || '',
    }
    if (!this.singlePage) {
      Object.assign(params, {
        pageNumber: this.pageInfo.pageNumber,
        pageSize: this.pageInfo.pageSize,
      })
    }
    return params as Partial<RetainParams>
  }

  private _retainParams() {
    const params: Partial<RetainParams> = {}
    if (this.pageInfo.pageNumber && this.pageInfo.pageSize) {
      params._offset = (this.pageInfo.pageNumber - 1) * this.pageInfo.pageSize
      params._length = this.pageInfo.pageSize
    }
    if (this.orderRule.prop) {
      params._sortKey = this.orderRule.prop
    }
    if (this.orderRule.order) {
      params._sortDirection = this.orderRule.order
    }
    return params
  }

  async reloadData(params = { updateQuery: true }) {
    if (params.updateQuery === undefined) {
      params.updateQuery = true
    }

    if (params.updateQuery) {
      this.updateQuery()
    }

    this.isLoading = true
    let loadData = this.delegate.loadData!
    if (!loadData && this.delegate.loadOnePageItems) {
      loadData = async (retainParams: Partial<RetainParams>) => {
        const items = await this.delegate.loadOnePageItems!(retainParams)
        return {
          offset: 0,
          length: items.length,
          totalCount: items.length,
          items: items,
        }
      }
    }
    try {
      const data = await loadData(this.forOldParams ? this._oldRetainParams() : this._retainParams())
      this.isLoading = false
      // TODO: 兼容方案
      if (data['elements']) {
        const data1 = data as PageData
        this.tableItems = data1.elements
        this.pageInfo.total = data1.totalSize
      } else {
        const data1 = data as PageResult
        this.tableItems = data1.items
        this.pageInfo.total = data1.totalCount
      }
    } catch (e) {
      this.isLoading = false
      this.tableItems = []
    }
    if (this.delegate.onDataChanged) {
      this.delegate.onDataChanged(this.tableItems)
    }
  }

  resetFilter(useQuery = false) {
    this.makeBasicSettings(useQuery)
    this.reloadData({ updateQuery: true })
  }

  getDefaultSettings() {
    let defaultSettings: DefaultSettings = {}
    if (typeof this.delegate.defaultSettings === 'function') {
      defaultSettings = this.delegate.defaultSettings()
    } else if (this.delegate.defaultSettings) {
      defaultSettings = this.delegate.defaultSettings
    }
    defaultSettings.pageNumber = defaultSettings.pageNumber || 1
    defaultSettings.pageSize = defaultSettings.pageSize || 10
    defaultSettings.sortKey = defaultSettings.sortKey || ''
    defaultSettings.sortDirection = defaultSettings.sortDirection || 'descending'
    return defaultSettings as {
      pageNumber: number
      pageSize: number
      sortKey: string
      sortDirection: 'ascending' | 'descending'
    }
  }

  makeBasicSettings(useQuery = false) {
    if (!this.reactiveQuery || !this.$route) {
      useQuery = false
    }
    const defaultSettings = this.getDefaultSettings()
    const query = useQuery ? this.$route.query : {}
    this.pageInfo.pageNumber = Number(query[this.getTargetKey('pageNumber')]) || defaultSettings.pageNumber
    this.pageInfo.pageSize = Number(query[this.getTargetKey('pageSize')]) || defaultSettings.pageSize
    this.orderRule.prop = (query[this.getTargetKey('sortKey')] || defaultSettings.sortKey) as string
    const sortType = query[this.getTargetKey('sortDirection')] || defaultSettings.sortDirection
    this.orderRule.order = sortType as any
  }

  getTargetKey(key: string) {
    return this.namespace ? `${this.namespace}.${key}` : key
  }
}
