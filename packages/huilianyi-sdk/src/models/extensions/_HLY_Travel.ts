import __HLY_Travel from '../auto-build/__HLY_Travel'
import {
  App_EmployeeTrafficData,
  App_TravelCoreItinerary,
  App_TravelExtrasData,
  App_TravelModel,
  HLY_TravelStatus,
} from '../../core'
import { Transaction } from 'fc-sql'

export class _HLY_Travel extends __HLY_Travel {
  public status!: HLY_TravelStatus
  public lastModifiedDate!: string

  public constructor() {
    super()
  }

  public static async findWithBusinessCode(businessCode: string, transaction?: Transaction) {
    return (await this.findOne(
      {
        business_code: businessCode,
      },
      transaction
    ))!
  }

  public async updateInfos(data: Partial<App_TravelModel>) {
    this.fc_edit()
    this.fc_generateWithModel(data)
    if (data.extrasData) {
      this.extrasInfo = JSON.stringify(data.extrasData)
      this.participantUserOidsStr = data.extrasData.participants.map((item) => item.userOID).join(',')
      this.participantUserNamesStr = data.extrasData.participants.map((item) => item.fullName).join(',')
    }
    if (data.itineraryItems) {
      this.itineraryItemsStr = JSON.stringify(data.itineraryItems)
    }
    if (data.expenseFormCodes) {
      this.expenseFormCodesStr = data.expenseFormCodes.join(',')
    }
    if (data.overlappedCodes) {
      this.overlappedCodesStr = data.overlappedCodes.join(',')
    }
    if (data.lastModifiedDate) {
      this.reloadTime = data.lastModifiedDate
    }
    await this.updateToDB()
  }

  public expenseFormCodes() {
    return (this.expenseFormCodesStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public overlappedCodes() {
    return (this.overlappedCodesStr || '')
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
    return (this.participantUserOidsStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public participantUserNames() {
    return (this.participantUserNamesStr || '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public extrasData(): App_TravelExtrasData {
    const defaultData: App_TravelExtrasData = {
      participants: [],
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
    data.overlappedCodes = this.overlappedCodes()
    delete data['participantUserOidsStr']
    delete data['participantUserNamesStr']
    delete data['expenseFormCodesStr']
    delete data['itineraryItemsStr']
    delete data['employeeTrafficItemsStr']
    delete data['overlappedCodesStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
