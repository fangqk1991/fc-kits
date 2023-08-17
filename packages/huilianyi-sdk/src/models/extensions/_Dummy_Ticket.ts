import __Dummy_Ticket from '../auto-build/__Dummy_Ticket'
import { DummyTicketModel } from '../../core'

export class _Dummy_Ticket extends __Dummy_Ticket {
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
