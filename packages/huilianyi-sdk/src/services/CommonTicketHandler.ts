import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TicketParams } from '../core'
import assert from '@fangcha/assert'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { TravelService } from './TravelService'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'

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

    let prevTravelItem: _HLY_Travel | null = null
    let nextTravelItem: _HLY_Travel | null = null

    commonTicket.fc_edit()
    if (params.customValid !== undefined) {
      commonTicket.customValid = params.customValid
    }
    if (params.customCode !== undefined) {
      if (commonTicket.customCode) {
        prevTravelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(commonTicket.customCode)
      }
      nextTravelItem = await this.modelsCore.HLY_Travel.findWithBusinessCode(params.customCode)
      assert.ok(!!nextTravelItem, `出差申请单[${params.customCode}] 不存在`)
      commonTicket.customCode = params.customCode
    }

    const runner = commonTicket.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await commonTicket.updateToDB(transaction)
      if (prevTravelItem) {
        await new TravelService(this.modelsCore).refreshTravelTicketsInfo(prevTravelItem, transaction)
      }
      if (nextTravelItem) {
        await new TravelService(this.modelsCore).refreshTravelTicketsInfo(nextTravelItem, transaction)
      }
    })
    return commonTicket.modelForClient()
  }
}
