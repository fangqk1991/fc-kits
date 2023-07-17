import __HLY_ExpenseApplication from '../auto-build/__HLY_ExpenseApplication'
import { HLY_ExpenseApplicationStatus } from '../../core/HLY_ExpenseApplicationStatus'
import { App_ApplicationExtrasData, App_ExpenseApplicationModel } from '../../core/App_ApplicationModels'

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
}
