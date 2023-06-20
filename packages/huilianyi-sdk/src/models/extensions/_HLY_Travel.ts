import __HLY_Travel from '../auto-build/__HLY_Travel'
import { App_TravelModel } from '../../core/App_CoreModels'

export class _HLY_Travel extends __HLY_Travel {
  public constructor() {
    super()
  }

  public static makeFeed(data: App_TravelModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }
}
