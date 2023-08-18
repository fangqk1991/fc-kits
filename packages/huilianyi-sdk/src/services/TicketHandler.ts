import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { DummyTicketParams } from '../core'
import { makeUUID } from '@fangcha/tools'

export class TicketHandler {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async createTicket(params: DummyTicketParams) {
    const staff = (await this.modelsCore.HLY_Staff.findWithUid(params.userOid))!

    const feed = new this.modelsCore.Dummy_Ticket()
    feed.orderType = params.orderType
    feed.userOid = params.userOid
    feed.trafficCode = params.trafficCode
    feed.fromTime = params.fromTime
    feed.toTime = params.toTime
    feed.fromCity = params.fromCity
    feed.toCity = params.toCity
    feed.businessCode = params.businessCode

    feed.ticketId = makeUUID()
    feed.employeeId = staff.employeeId
    feed.userName = staff.fullName
    feed.baseCity = staff.baseCity
    feed.isValid = 1
    await feed.addToDB()
    return feed
  }
}
