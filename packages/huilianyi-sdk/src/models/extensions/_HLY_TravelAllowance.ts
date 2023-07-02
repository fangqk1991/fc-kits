import __HLY_TravelAllowance from '../auto-build/__HLY_TravelAllowance'
import { App_TravelAllowanceItem, App_TravelAllowanceModel } from '../../core/App_CoreModels'

export class _HLY_TravelAllowance extends __HLY_TravelAllowance {
  public constructor() {
    super()
  }

  public extrasData(): any {
    const defaultData = {}
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public detailItems(): App_TravelAllowanceItem[] {
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
