import __CTrip_Order from '../auto-build/__CTrip_Order'
import { CTrip_FlightOrderInfoEntity } from '@fangcha/ctrip-sdk'

export class _CTrip_Order extends __CTrip_Order {
  public constructor() {
    super()
  }

  public extrasData(): any {
    const defaultData: any = {}
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public flightChangeInfo() {
    const orderItem = this.extrasData() as CTrip_FlightOrderInfoEntity
    return Array.isArray(orderItem.FlightChangeInfo) &&
      orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
      ? orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
      : null
  }
}
