import __HLY_ExpenseApplication from '../auto-build/__HLY_ExpenseApplication'
import { HLY_ExpenseApplicationStatus } from '../../core/HLY_ExpenseApplicationStatus'
import { App_ApplicationExtrasData, App_ExpenseApplicationModel } from '../../core/App_ApplicationModels'
import { FilterOptions } from 'fc-feed'
import { MonthAmountReport } from '../../core/App_CoreModels'

export class _HLY_ExpenseApplication extends __HLY_ExpenseApplication {
  public lastModifiedDate!: string

  formStatus!: HLY_ExpenseApplicationStatus

  public constructor() {
    super()
  }

  public static makeFeed(data: App_ExpenseApplicationModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }

  public static async getFormNameList() {
    const searcher = new this().fc_searcher()
    searcher.processor().setColumns(['form_name'])
    searcher.processor().markDistinct()
    const feeds = await searcher.queryAllFeeds()
    return feeds.map((item) => item.formName)
  }

  public extrasData(): App_ApplicationExtrasData {
    const defaultData: App_ApplicationExtrasData = {
      customProps: {},
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_ExpenseApplicationModel
    data.extrasData = this.extrasData()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }

  public static async getMonthReports(filterOptions: FilterOptions = {}) {
    return await this.getAggregationData<MonthAmountReport>({
      columns: ['DATE_FORMAT(created_date, "%Y-%m") AS month', 'COUNT(*) AS count', 'SUM(total_amount) AS totalAmount'],
      groupByKeys: ['month'],
      customHandler: (searcher) => {
        searcher.setOptionStr('ORDER BY month ASC')
      },
      filterOptions: filterOptions,
    })
  }
}
