import { _HLY_OrderBase } from './_HLY_OrderBase'
import { App_TravelOrderTrain } from '../../core'

export class _HLY_OrderHotel extends _HLY_OrderBase {
  public constructor() {
    super()
  }

  public modelForClient(): App_TravelOrderTrain {
    return super.modelForClient()
  }
}

_HLY_OrderHotel.addStaticOptions({
  table: 'hly_order_hotel',
})
