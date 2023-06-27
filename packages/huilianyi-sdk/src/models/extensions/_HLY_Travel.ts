import __HLY_Travel from '../auto-build/__HLY_Travel'
import { App_TravelCoreItinerary, App_TravelExtrasData, App_TravelModel } from '../../core/App_CoreModels'

export class _HLY_Travel extends __HLY_Travel {
  public lastModifiedDate!: string

  public constructor() {
    super()
  }

  public static makeFeed(data: App_TravelModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    feed.expenseFormCodesStr = data.expenseFormCodes.join(',')
    return feed
  }

  public expenseFormCodes() {
    return this.expenseFormCodesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public extrasData(): App_TravelExtrasData {
    const defaultData: App_TravelExtrasData = {
      itineraryMap: {},
      customProps: {},
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public itineraryItems(): App_TravelCoreItinerary[] {
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
    data.expenseFormCodes = this.expenseFormCodes()
    data.extrasData = this.extrasData()
    data.itineraryItems = this.itineraryItems()
    delete data['expenseFormCodesStr']
    delete data['itineraryItemsStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
