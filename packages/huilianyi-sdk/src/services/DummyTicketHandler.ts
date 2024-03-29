import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TrafficTicket, DummyTicketParams } from '../core'
import { makeUUID } from '@fangcha/tools'
import assert from '@fangcha/assert'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { TravelService } from './TravelService'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'

export class DummyTicketHandler {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
    this.modelsCore = syncCore.modelsCore
  }

  public async createDummyTicket(params: DummyTicketParams) {
    assert.ok(!!params.orderType, `票据类型不能为空`)
    assert.ok(!!params.trafficCode, `车次号/航班号不能为空`)
    assert.ok(!!params.fromCity, `出发城市不能为空`)
    assert.ok(!!params.toCity, `到达城市不能为空`)
    assert.ok(!!params.fromTime, `行程时间不能为空`)
    assert.ok(!!params.toTime, `行程时间不能为空`)

    const staff = (await this.modelsCore.HLY_Staff.findWithUid(params.userOid))!
    assert.ok(!!staff, `员工[${params.userOid}] 不存在`)
    const travelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(params.businessCode)
    assert.ok(!!travelItem, `出差申请单[${params.businessCode}] 不存在`)

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
      const businessCode = dummyTicket.businessCode || ''
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
        businessCode: businessCode,
        hlyCode: businessCode,
        customCode: businessCode,
        isValid: dummyTicket.isValid,
        remarks: dummyTicket.remarks,
        isDummy: 1,
      }
      trafficTicket.fc_generateWithModel(params)
      await trafficTicket.addToDB(transaction)
      await new TravelService(this.modelsCore).refreshTravelTicketsInfo(travelItem, transaction)
    })
    return dummyTicket
  }

  public async updateDummyTicket(ticketId: string, params: Partial<DummyTicketParams>) {
    const options: Partial<DummyTicketParams> = {
      orderType: params.orderType,
      userOid: params.userOid,
      trafficCode: params.trafficCode,
      fromTime: params.fromTime,
      toTime: params.toTime,
      fromCity: params.fromCity,
      toCity: params.toCity,
      businessCode: params.businessCode,
      remarks: params.remarks,
      isValid: params.isValid,
    }
    Object.keys(options)
      .filter((key) => options[key] === undefined)
      .forEach((key) => delete options[key])

    const dummyTicket = (await this.modelsCore.Dummy_Ticket.findWithUid(ticketId))!
    assert.ok(!!dummyTicket, `虚拟票据[${ticketId}] 不存在`)

    const realTicket = (await this.modelsCore.HLY_TrafficTicket.findWithUid(dummyTicket.ticketId))!
    assert.ok(!!realTicket, `常规票据[${dummyTicket.ticketId}] 不存在`)

    const curTravelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(dummyTicket.businessCode)
    assert.ok(!!curTravelItem, `出差申请单[${dummyTicket.businessCode}] 不存在`)

    dummyTicket.fc_edit()
    realTicket.fc_edit()

    dummyTicket.fc_generateWithModel(options)
    realTicket.fc_generateWithModel(options)

    let nextTravelItem: _HLY_Travel | null = null
    if (options.businessCode && options.businessCode !== curTravelItem.businessCode) {
      nextTravelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(options.businessCode)
      assert.ok(!!nextTravelItem, `出差申请单[${options.businessCode}] 不存在`)
      realTicket.businessCode = options.businessCode
      realTicket.customCode = options.businessCode
    }

    const runner = dummyTicket.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await dummyTicket.updateToDB(transaction)
      await realTicket.updateToDB(transaction)
      await new TravelService(this.modelsCore).refreshTravelTicketsInfo(curTravelItem, transaction)
      if (nextTravelItem) {
        await new TravelService(this.modelsCore).refreshTravelTicketsInfo(nextTravelItem, transaction)
      }
    })
    await realTicket.reloadDataFromDB()
    return {
      dummyTicket: dummyTicket.modelForClient(),
      commonTicket: realTicket.modelForClient(),
    }
  }
}
