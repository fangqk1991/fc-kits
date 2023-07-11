import { _HLY_OrderFlight } from './_HLY_OrderFlight'
import { App_TravelOrderTrain } from '../../core/App_CoreModels'

export class _HLY_OrderTrain extends _HLY_OrderFlight {
  public constructor() {
    super()
  }

  public modelForClient(): App_TravelOrderTrain {
    return super.modelForClient()
  }
}

_HLY_OrderTrain.addStaticOptions({
  table: 'hly_order_train',
})
