import __CTrip_Ticket from '../auto-build/__CTrip_Ticket'
import { App_OrderBizType, App_TrafficTicket, HLY_OrderType } from '../../core'

export class _CTrip_Ticket extends __CTrip_Ticket {
  public constructor() {
    super()
  }

  public fc_searcher(params = {}) {
    const searcher = super.fc_searcher(params)
    if (params['bizType']) {
      switch (params['bizType'] as App_OrderBizType) {
        case App_OrderBizType.HasBusinessCode:
          searcher.processor().addSpecialCondition('business_code != ""')
          break
        case App_OrderBizType.SpecialOrder:
          searcher.processor().addConditionKeyInArray('journey_no', ['紧急预订', '紧急预定'])
          break
        case App_OrderBizType.Others:
          searcher
            .processor()
            .addSpecialCondition('business_code IS NULL AND journey_no NOT IN ("紧急预订", "紧急预定")')
          break
      }
    }
    return searcher
  }

  public orderType!: HLY_OrderType
  public makeCommonTicket(): App_TrafficTicket {
    const ctripValid = ['已购票', '待出票', '已成交', '航班变更'].includes(this.ctripStatus!) ? 1 : 0
    return {
      ticketId: this.deprecatedId || this.ticketId,
      orderType: this.orderType,
      orderId: this.orderId,
      orderOid: '',
      userOid: this.userOid,
      employeeId: this.employeeId || '',
      userName: this.userName,
      baseCity: this.baseCity,
      trafficCode: this.trafficCode,
      fromTime: this.fromTime!,
      toTime: this.toTime!,
      fromCity: this.fromCity,
      toCity: this.toCity,
      journeyNo: this.journeyNo,
      businessCode: this.businessCode,
      hlyCode: this.businessCode,
      customCode: '',
      isValid: ctripValid,
      isDummy: 0,
      ctripValid: ctripValid,
      ctripStatus: this.ctripStatus!,
    }
  }
}
