import __HLY_Expense from '../auto-build/__HLY_Expense'
import { App_ExpenseExtrasData, App_ExpenseModel } from '../../core/App_CoreModels'
import { HLY_ExpenseType } from '../../core/HLY_ExpenseModels'
import { HLY_ExpenseStatus } from '../../core/HLY_ExpenseStatus'

export class _HLY_Expense extends __HLY_Expense {
  public lastModifiedDate!: string

  expenseType!: HLY_ExpenseType
  expenseStatus!: HLY_ExpenseStatus

  public constructor() {
    super()
  }

  public static makeFeed(data: App_ExpenseModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    feed.applyFormCodesStr = data.applyFormCodes.join(',')
    return feed
  }

  public applyFormCodes() {
    return this.applyFormCodesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
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

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_ExpenseModel
    data.applyFormCodes = this.applyFormCodes()
    data.extrasData = this.extrasData()
    delete data['applyFormCodesStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
