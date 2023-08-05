import __HLY_TrafficTicket from '../auto-build/__HLY_TrafficTicket'
import { App_OrderBizType, App_TrafficTicket, HLY_OrderType, UserTicketReport } from '../../core'
import { FilterOptions } from 'fc-feed'

export class _HLY_TrafficTicket extends __HLY_TrafficTicket {
  orderType!: HLY_OrderType

  public constructor() {
    super()
  }

  public static async userTicketReporters(filterOptions: FilterOptions = {}) {
    //   const sql = `SELECT
    //                    user_oid,
    //                    user_name,
    //                    COUNT(*) AS count,
    // COUNT( IF(is_valid = 1, 1, NULL)) AS validCount,
    // COUNT( IF(is_valid = 0, 1, NULL)) AS invalidCount
    //                FROM
    //                    hly_traffic_ticket
    //                GROUP BY
    //                    user_oid,
    //                    user_name ORDER BY CONVERT(user_name USING gbk)`
    //   return (await new this().dbSpec().database.query(sql)) as UserTicketReport[]

    const searcher = new this().fc_searcher(filterOptions)
    searcher
      .processor()
      .setColumns([
        'user_oid AS userOid',
        'user_name AS userName',
        'COUNT(*) AS count',
        'COUNT(IF(is_valid = 1, 1, NULL)) AS validCount',
        'COUNT(IF(is_valid = 0, 1, NULL)) AS invalidCount',
      ])
    searcher.processor().setGroupByKeys(['userOid', 'userName'])
    searcher.processor().addSpecialCondition('user_oid != ?', '')
    searcher.processor().setOptionStr('HAVING count > 0')
    searcher.processor().addOrderRule('CONVERT(user_name USING gbk)', 'ASC')
    return (await searcher.processor().queryList()) as UserTicketReport[]
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
      useForAllowance: this.useForAllowance,
    }
  }
}
