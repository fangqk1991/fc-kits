import { _HLY_OrderBase } from './_HLY_OrderBase'
import { App_TravelOrderFlight } from '../../core'

export class _HLY_OrderFlight extends _HLY_OrderBase {
  public constructor() {
    super()
  }

  public modelForClient(): App_TravelOrderFlight {
    return super.modelForClient()
  }
}

_HLY_OrderFlight.addStaticOptions({
  table: 'hly_order_flight',
})
