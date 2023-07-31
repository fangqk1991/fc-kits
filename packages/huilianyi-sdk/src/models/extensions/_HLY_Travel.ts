import __HLY_Travel from '../auto-build/__HLY_Travel'
import {
  App_EmployeeTrafficData,
  App_TravelCoreItinerary,
  App_TravelExtrasData,
  App_TravelModel,
  HLY_TravelStatus,
} from '../../core'

export class _HLY_Travel extends __HLY_Travel {
  public status!: HLY_TravelStatus
  public lastModifiedDate!: string

  public constructor() {
    super()
  }

  public static async findWithBusinessCode(businessCode: string) {
    return (await this.findOne({
      business_code: businessCode,
    }))!
  }

  public static makeFeed(data: App_TravelModel) {
    const feed = new this()
    feed.fc_generateWithModel(data)
    feed.extrasInfo = JSON.stringify(data.extrasData)
    feed.expenseFormCodesStr = data.expenseFormCodes.join(',')
    feed.participantUserOidsStr = data.extrasData.participants.map((item) => item.userOID).join(',')
    return feed
  }

  public expenseFormCodes() {
    return this.expenseFormCodesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public ticketIdList() {
    return (this.ticketIdListStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public participantUserOids() {
    return this.participantUserOidsStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public extrasData(): App_TravelExtrasData {
    const defaultData: App_TravelExtrasData = {
      participants: [],
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

  public employeeTrafficItems(): App_EmployeeTrafficData[] {
    const defaultData: any[] = []
    try {
      return JSON.parse(this.employeeTrafficItemsStr) || defaultData
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
    data.employeeTrafficItems = this.employeeTrafficItems()
    delete data['participantUserOidsStr']
    delete data['expenseFormCodesStr']
    delete data['itineraryItemsStr']
    delete data['employeeTrafficItemsStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
