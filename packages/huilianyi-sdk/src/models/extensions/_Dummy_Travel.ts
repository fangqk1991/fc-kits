import __Dummy_Travel from '../auto-build/__Dummy_Travel'
import { DummyTravelModel } from '../../core'

export class _Dummy_Travel extends __Dummy_Travel {
  public constructor() {
    super()
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    return this.fc_pureModel() as DummyTravelModel
  }
}
