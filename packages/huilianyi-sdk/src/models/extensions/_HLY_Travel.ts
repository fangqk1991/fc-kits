import __HLY_Travel from '../auto-build/__HLY_Travel'
import {
  App_EmployeeTrafficData,
  App_TrafficTicket,
  App_TravelCoreItinerary,
  App_TravelExtrasData,
  App_TravelModel,
  TravelMonthSection,
} from '../../core/App_CoreModels'
import { HLY_TravelStatus } from '../../core/HLY_TravelStatus'
import { HuilianyiFormatter } from '../../client/HuilianyiFormatter'

export class _HLY_Travel extends __HLY_Travel {
  public status!: HLY_TravelStatus
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

  public ticketItems(): App_TrafficTicket[] {
    const defaultData: any[] = []
    try {
      return JSON.parse(this.ticketItemsStr) || defaultData
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

  public monthSectionInfos(): TravelMonthSection[] {
    return HuilianyiFormatter.transferMonthSectionInfos(this.itineraryItems())
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_TravelModel
    data.expenseFormCodes = this.expenseFormCodes()
    data.extrasData = this.extrasData()
    data.itineraryItems = this.itineraryItems()
    data.ticketItems = this.ticketItems()
    data.employeeTrafficItems = this.employeeTrafficItems()
    delete data['expenseFormCodesStr']
    delete data['itineraryItemsStr']
    delete data['ticketItemsStr']
    delete data['employeeTrafficItemsStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
