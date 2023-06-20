import __HLY_Expense from '../auto-build/__HLY_Expense'
import { App_ExpenseExtrasData, App_ExpenseModel } from '../../core/App_CoreModels'
import { HLY_ExpenseType } from '../../core/HLY_ReimbursementModels'
import { HLY_ReimburseStatus } from '../../core/HLY_ReimburseStatus'

export class _HLY_Expense extends __HLY_Expense {
  expenseType!: HLY_ExpenseType
  expenseStatus!: HLY_ReimburseStatus

  public constructor() {
    super()
  }

  public static makeFeed(data: App_ExpenseModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }

  public extrasData(): App_ExpenseExtrasData {
    const defaultData: App_ExpenseExtrasData = {
      customProps: {},
      customFormValueVOList: [],
      invoiceVOList: [],
      expenseProps: {},
      expenseFieldVOList: [],
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_ExpenseModel
    data.extrasData = this.extrasData()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
