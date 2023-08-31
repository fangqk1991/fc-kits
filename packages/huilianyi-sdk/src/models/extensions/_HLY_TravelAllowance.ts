import __HLY_TravelAllowance from '../auto-build/__HLY_TravelAllowance'
import {
  AllowanceDayItem,
  App_AllowanceCustomData,
  App_TravelAllowanceExtrasData,
  App_TravelAllowanceModel,
} from '../../core'

export class _HLY_TravelAllowance extends __HLY_TravelAllowance {
  public constructor() {
    super()
  }

  public extrasData(): App_TravelAllowanceExtrasData {
    const defaultData: App_TravelAllowanceExtrasData = {
      itineraryItems: [],
      closedLoops: [],
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public customData(): App_AllowanceCustomData {
    const defaultData: App_AllowanceCustomData = {
      daysCount: 0,
      amount: 0,
      detailItems: [],
    }
    try {
      return JSON.parse(this.customDataStr) || defaultData
    } catch (e) {}
    return defaultData
  }

  public detailItems(): AllowanceDayItem[] {
    const defaultData: any[] = []
    try {
      return JSON.parse(this.detailItemsStr) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_TravelAllowanceModel
    data.extrasData = this.extrasData()
    data.detailItems = this.detailItems()
    data.customData = this.customData()
    delete data['detailItemsStr']
    delete data['customDataStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
