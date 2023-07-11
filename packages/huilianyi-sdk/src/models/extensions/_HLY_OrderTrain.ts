import { App_TravelOrderTrain } from '../../core/App_CoreModels'
import { _HLY_OrderBase } from './_HLY_OrderBase'

export class _HLY_OrderTrain extends _HLY_OrderBase {
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
