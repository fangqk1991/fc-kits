import __HLY_OrderFlight from '../auto-build/__HLY_OrderFlight'
import { App_TravelOrderFlight, App_TravelOrderFlightExtras } from '../../core/App_CoreModels'

export class _HLY_OrderFlight extends __HLY_OrderFlight {
  public constructor() {
    super()
  }

  public static makeFeed(data: App_TravelOrderFlight) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }

  public extrasData(): App_TravelOrderFlightExtras {
    const defaultData: App_TravelOrderFlightExtras = {
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
    const data = this.fc_pureModel() as App_TravelOrderFlight
    data.extrasData = this.extrasData()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
