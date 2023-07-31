import __HLY_TrafficTicket from '../auto-build/__HLY_TrafficTicket'
import { App_OrderBizType, App_TrafficTicket, HLY_OrderType } from '../../core'

export class _HLY_TrafficTicket extends __HLY_TrafficTicket {
  orderType!: HLY_OrderType

  public constructor() {
    super()
  }

  public fc_searcher(params = {}) {
    const searcher = super.fc_searcher(params)
    if (params['bizType']) {
      switch (params['bizType'] as App_OrderBizType) {
        case App_OrderBizType.HasBusinessCode:
          searcher.processor().addSpecialCondition('business_code != ?', '')
          break
        case App_OrderBizType.SpecialOrder:
          searcher.processor().addConditionKeyInArray('journey_no', ['紧急预订', '紧急预定'])
          break
        case App_OrderBizType.Others:
          searcher.processor().addSpecialCondition('business_code = "" AND journey_no NOT IN ("紧急预订", "紧急预定")')
          break
      }
    }
    return searcher
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
      businessCode: this.businessCode,
      isValid: this.isValid,
    }
  }
}
