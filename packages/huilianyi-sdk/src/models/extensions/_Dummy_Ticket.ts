import __Dummy_Ticket from '../auto-build/__Dummy_Ticket'
import { DummyTicketModel, HLY_OrderType } from '../../core'

export class _Dummy_Ticket extends __Dummy_Ticket {
  public orderType!: HLY_OrderType

  public constructor() {
    super()
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    return this.fc_pureModel() as DummyTicketModel
  }
}
