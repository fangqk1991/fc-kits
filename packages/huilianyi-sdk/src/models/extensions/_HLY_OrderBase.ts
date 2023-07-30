import __HLY_OrderBase from '../auto-build/__HLY_OrderBase'
import { App_OrderBizType, App_TravelOrderBase, App_TravelOrderExtras } from '../../core'

export class _HLY_OrderBase extends __HLY_OrderBase {
  public businessCode!: string

  public constructor() {
    super()
  }

  public fc_searcher(params = {}) {
    const searcher = super.fc_searcher(params)
    if (params['bizType']) {
      switch (params['bizType'] as App_OrderBizType) {
        case App_OrderBizType.HasBusinessCode:
          searcher.processor().addSpecialCondition('business_code IS NOT NULL')
          break
        case App_OrderBizType.SpecialOrder:
          searcher.processor().addConditionKeyInArray('journey_no', ['紧急预订', '紧急预定'])
          break
        case App_OrderBizType.Others:
          searcher
            .processor()
            .addSpecialCondition('business_code IS NULL AND journey_no NOT IN ("紧急预订", "紧急预定")')
          break
      }
    }
    return searcher
  }

  public static makeFeed(data: App_TravelOrderBase) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    feed.ticketUserOidsStr = data.ticketUserOids.join(',')
    feed.ticketUserNamesStr = data.ticketUserNames.join(',')
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
      userNamesStr: '',
      tickets: [],
      commonTickets: [],
      startTime: '',
      endTime: '',
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public ticketUserOids() {
    return this.ticketUserOidsStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public ticketUserNames() {
    return this.ticketUserNamesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_TravelOrderBase
    data.ticketUserOids = this.ticketUserOids()
    data.ticketUserNames = this.ticketUserNames()
    data.extrasData = this.extrasData()
    delete data['ticketUserOidsStr']
    delete data['ticketUserNamesStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
