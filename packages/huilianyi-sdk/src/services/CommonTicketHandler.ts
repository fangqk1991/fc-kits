import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TicketParams } from '../core'
import assert from '@fangcha/assert'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { TravelService } from './TravelService'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { NumBoolDescriptor } from '@fangcha/tools'

export class CommonTicketHandler {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
    this.modelsCore = syncCore.modelsCore
  }

  public async updateTicket(ticketId: string, params: Partial<App_TicketParams>) {
    const commonTicket = (await this.modelsCore.HLY_TrafficTicket.findWithUid(ticketId))!
    assert.ok(!!commonTicket, `票据[${ticketId}] 不存在`)
    assert.ok(!commonTicket.isDummy, `本操作不支持虚拟票据`)

    const curTravelItem = commonTicket.businessCode
      ? await this.modelsCore.HLY_Travel.findWithBusinessCode(commonTicket.businessCode)
      : null
    let nextTravelItem: _HLY_Travel | null = null

    commonTicket.fc_edit()
    if (params.customValid !== undefined) {
      assert.ok(
        params.customValid === null || NumBoolDescriptor.checkValueValid(params.customValid),
        `customValid invalid.`
      )
      commonTicket.customValid = params.customValid
      commonTicket.isValid = params.customValid !== null ? params.customValid : commonTicket.ctripValid
    }
    if (params.customCode !== undefined) {
      nextTravelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(params.customCode)
      assert.ok(!!nextTravelItem, `出差申请单[${params.customCode}] 不存在`)
      commonTicket.customCode = params.customCode
      commonTicket.businessCode = params.customCode
    }

    const runner = commonTicket.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await commonTicket.updateToDB(transaction)
      if (curTravelItem) {
        await new TravelService(this.modelsCore).refreshTravelTicketsInfo(curTravelItem, transaction)
      }
      if (nextTravelItem) {
        await new TravelService(this.modelsCore).refreshTravelTicketsInfo(nextTravelItem, transaction)
      }
    })
    return commonTicket
  }
}
