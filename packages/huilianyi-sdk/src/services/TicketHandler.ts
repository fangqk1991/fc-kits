import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { DummyTicketParams } from '../core'
import { makeUUID } from '@fangcha/tools'
import assert from '@fangcha/assert'

export class TicketHandler {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async createTicket(params: DummyTicketParams) {
    assert.ok(!!params.orderType, `票据类型不能为空`)
    assert.ok(!!params.trafficCode, `车次号/航班号不能为空`)
    assert.ok(!!params.fromCity, `出发城市不能为空`)
    assert.ok(!!params.toCity, `到达城市不能为空`)
    assert.ok(!!params.fromTime, `行程时间不能为空`)
    assert.ok(!!params.toTime, `行程时间不能为空`)

    const staff = (await this.modelsCore.HLY_Staff.findWithUid(params.userOid))!
    assert.ok(!!staff, `员工[${params.userOid}] 不存在`)
    assert.ok(
      !!(await this.modelsCore.HLY_Travel.findWithBusinessCode(params.businessCode)) ||
        !!(await this.modelsCore.Dummy_Travel.findWithBusinessCode(params.businessCode)),
      `出差申请单[${params.businessCode}] 不存在`
    )

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
