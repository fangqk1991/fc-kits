import __HLY_Travel from '../auto-build/__HLY_Travel'
import { App_TravelExtrasData, App_TravelModel } from '../../core/App_CoreModels'

export class _HLY_Travel extends __HLY_Travel {
  public lastModifiedDate!: string

  public constructor() {
    super()
  }

  public static makeFeed(data: App_TravelModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    return feed
  }

  public extrasData(): App_TravelExtrasData {
    const defaultData: App_TravelExtrasData = {
      customProps: {},
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public itineraryItems(): any[] {
    const defaultData: any[] = []
    try {
      return JSON.parse(this.itineraryItemsStr) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_TravelModel
    data.extrasData = this.extrasData()
    data.itineraryItems = this.itineraryItems()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
