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

  public static async getOrderStatusList() {
    const searcher = new this().fc_searcher()
    searcher.processor().setColumns(['order_status'])
    searcher.processor().markDistinct()
    const feeds = await searcher.queryAllFeeds()
    return feeds.map((item) => item.orderStatus)
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
