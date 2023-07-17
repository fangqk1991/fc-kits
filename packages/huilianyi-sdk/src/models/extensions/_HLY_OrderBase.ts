import __HLY_OrderBase from '../auto-build/__HLY_OrderBase'
import { App_TravelOrderBase, App_TravelOrderExtras } from '../../core/App_TravelModels'

export class _HLY_OrderBase extends __HLY_OrderBase {
  public businessCode!: string

  public constructor() {
    super()
  }

  public static makeFeed(data: App_TravelOrderBase) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }

  public extrasData(): App_TravelOrderExtras {
    const defaultData: App_TravelOrderExtras = {
      usersStr: '',
      tickets: [],
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
    const data = this.fc_pureModel() as App_TravelOrderBase
    data.extrasData = this.extrasData()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
