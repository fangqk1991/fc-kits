import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TrafficTicket, DummyTicketParams } from '../core'
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

    const dummyTicket = new this.modelsCore.Dummy_Ticket()
    dummyTicket.orderType = params.orderType
    dummyTicket.userOid = params.userOid
    dummyTicket.trafficCode = params.trafficCode
    dummyTicket.fromTime = params.fromTime
    dummyTicket.toTime = params.toTime
    dummyTicket.fromCity = params.fromCity
    dummyTicket.toCity = params.toCity
    dummyTicket.businessCode = params.businessCode
    dummyTicket.remarks = params.remarks || ''

    dummyTicket.ticketId = makeUUID()
    dummyTicket.employeeId = staff.employeeId
    dummyTicket.userName = staff.fullName
    dummyTicket.baseCity = staff.baseCity
    dummyTicket.isValid = 1

    const runner = dummyTicket.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await dummyTicket.addToDB(transaction)
      const trafficTicket = new this.modelsCore.HLY_TrafficTicket()
      const params: App_TrafficTicket = {
        ticketId: dummyTicket.ticketId,
        orderType: dummyTicket.orderType,
        orderId: dummyTicket.orderId,
        orderOid: `${dummyTicket.ticketId}`,
        trafficCode: dummyTicket.trafficCode,
        fromTime: dummyTicket.fromTime!,
        toTime: dummyTicket.toTime!,
        fromCity: dummyTicket.fromCity,
        toCity: dummyTicket.toCity,
        userOid: dummyTicket.userOid,
        employeeId: dummyTicket.employeeId || '',
        userName: dummyTicket.userName,
        baseCity: dummyTicket.baseCity,
        journeyNo: '',
        businessCode: dummyTicket.businessCode || '',
        isValid: dummyTicket.isValid,
        isDummy: 1,
      }
      trafficTicket.fc_generateWithModel(params)
      await trafficTicket.addToDB(transaction)
    })
    return dummyTicket
  }
}
