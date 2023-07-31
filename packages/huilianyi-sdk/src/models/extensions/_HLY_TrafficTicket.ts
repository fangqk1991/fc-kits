import __HLY_TrafficTicket from '../auto-build/__HLY_TrafficTicket'
import { App_TrafficTicket, HLY_OrderType } from '../../core'

export class _HLY_TrafficTicket extends __HLY_TrafficTicket {
  orderType!: HLY_OrderType

  public constructor() {
    super()
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient(): App_TrafficTicket {
    return {
      ticketId: this.ticketId,
      orderType: this.orderType,
      orderId: this.orderId,
      orderOid: this.orderOid,
      userOid: this.userOid,
      employeeId: this.employeeId || '',
      userName: this.userName,
      trafficCode: this.trafficCode,
      fromTime: this.fromTime || '',
      toTime: this.toTime || '',
      fromCity: this.fromCity,
      toCity: this.toCity,
      journeyNo: this.journeyNo,
      businessCode: this.businessCode || '',
      isValid: this.isValid,
    }
  }
}
