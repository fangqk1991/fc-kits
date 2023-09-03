import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TicketParams } from '../core'
import assert from '@fangcha/assert'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'

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

    params
  }
}
