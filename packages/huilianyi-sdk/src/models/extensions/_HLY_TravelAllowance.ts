import __HLY_TravelAllowance from '../auto-build/__HLY_TravelAllowance'
import {
  AllowanceDayItem,
  App_AllowanceCoreData,
  App_AllowanceCustomInfo,
  App_TravelAllowanceExtrasData,
  App_TravelAllowanceModel,
  TravelTools,
} from '../../core'
import assert from '@fangcha/assert'
import { md5 } from '@fangcha/tools'

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

  public customData(): App_AllowanceCoreData {
    const defaultData: App_AllowanceCoreData = {
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

  public async updateCoreInfo(params: App_AllowanceCustomInfo) {
    assert.ok(params.useCustom !== undefined, 'params.useCustom invalid.')
    assert.ok(params.customData !== undefined, 'params.customData invalid.')
    assert.ok(!Number.isNaN(params.customData.daysCount), 'params.customData.daysCount invalid.')
    assert.ok(!Number.isNaN(params.customData.amount), 'params.customData.daysCount invalid.')
    assert.ok(Array.isArray(params.customData.detailItems), 'params.customData.detailItems invalid.')

    this.fc_edit()
    this.useCustom = params.useCustom ? 1 : 0
    this.customDataStr = JSON.stringify(params.customData)

    const coreData = TravelTools.makeAllowanceCoreData(
      this.useCustom ? params.customData.detailItems : this.detailItems()
    )
    this.daysCount = coreData.daysCount
    this.amount = coreData.amount
    this.snapHash = md5([this.uid, this.daysCount, this.amount].join(','))

    await this.updateToDB()
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
