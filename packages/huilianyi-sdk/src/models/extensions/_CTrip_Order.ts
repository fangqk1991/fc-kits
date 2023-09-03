import __CTrip_Order from '../auto-build/__CTrip_Order'

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
}
