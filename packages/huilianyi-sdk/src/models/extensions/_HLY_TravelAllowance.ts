import __HLY_TravelAllowance from '../auto-build/__HLY_TravelAllowance'
import { AllowanceDayItem, App_TravelAllowanceExtrasData, App_TravelAllowanceModel, } from '../../core'

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
    delete data['detailItemsStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
