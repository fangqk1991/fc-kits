import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { HLY_OrderType, TimeUtils } from '../core'
import * as moment from 'moment/moment'
import { SQLBulkAdder } from 'fc-sql'
import {
  CTrip_FlightChangeType,
  CTrip_FlightOrderInfoEntity,
  CTrip_OrderType,
  CTrip_TrainOrderInfoEntity,
} from '@fangcha/ctrip-sdk'
import { md5 } from '@fangcha/tools'

export class CTripSyncHandler {
  syncCore: HuilianyiSyncCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
  }

  public async fetchCtripOrderIds(startTime?: string) {
    const cTripProxy = this.syncCore.cTripProxy
    if (!cTripProxy) {
      return []
    }

    startTime = startTime || '2023-06-01 00:00:00'
    const curMoment = TimeUtils.momentUTC8(startTime).startOf('month')
    let orderIdList: number[] = []
    while (curMoment.valueOf() < moment().valueOf()) {
      const toMoment = moment(Math.min(moment(curMoment).add(1, 'month').valueOf(), moment().valueOf()))
      const idList = await cTripProxy.queryOrderIdList(
        {
          from: TimeUtils.timeStrUTC8(curMoment.format()),
          to: TimeUtils.timeStrUTC8(toMoment.format()),
        },
        {
          SearchTypes: [1, 3],
        }
      )
      curMoment.add(1, 'month')
      orderIdList = orderIdList.concat(idList)
    }
    return orderIdList
  }

  public async dumpCtripOrders() {
    const cTripProxy = this.syncCore.cTripProxy
    if (!cTripProxy) {
      return
    }
    const syncCore = this.syncCore
    const CTrip_Order = syncCore.modelsCore.CTrip_Order

    const orderIdList = await this.fetchCtripOrderIds()

    const dbSpec = new CTrip_Order().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(['order_id'])
    for (const orderId of orderIdList) {
      bulkAdder.putObject({
        order_id: orderId,
      })
    }
    await bulkAdder.execute()

    {
      const searcher = new syncCore.modelsCore.CTrip_Order().fc_searcher()
      searcher.processor().setColumns(['order_id'])
      searcher.processor().addConditionKV('is_locked', 0)
      const feeds = await searcher.queryFeeds()
      console.info(`CTrip_Order: ${feeds.length} items to refresh.`)

      await cTripProxy.stepSearchOrderItems(
        feeds.map((item) => item.orderId),
        async (records, offset) => {
          const dbSpec = new CTrip_Order().dbSpec()
          const bulkAdder = new SQLBulkAdder(dbSpec.database)
          bulkAdder.setTable(dbSpec.table)
          bulkAdder.useUpdateWhenDuplicate()
          bulkAdder.setInsertKeys(dbSpec.insertableCols())
          bulkAdder.declareTimestampKey('created_date')
          for (const record of records) {
            if (record.TrainOrderInfoList) {
              offset += record.TrainOrderInfoList.length
              console.info(`[dumpCtripOrders] ${offset} / ${feeds.length}`)
              for (const orderItem of record.TrainOrderInfoList) {
                const feed = new CTrip_Order()
                feed.orderId = Number(orderItem.BasicInfo.OrderID)
                feed.orderType = HLY_OrderType.TRAIN
                feed.employeeId = orderItem.BasicInfo.EmployeeID || null
                feed.userName = orderItem.BasicInfo.UserName || ''
                feed.orderStatus = orderItem.BasicInfo.NewOrderStatusName || orderItem.BasicInfo.OrderStatusName
                feed.changeStatus = orderItem.BasicInfo.ChangeTicketStatusName || ''
                feed.journeyNo = orderItem.CorpOrderInfo.JourneyID || ''
                feed.businessCode =
                  feed.journeyNo && /^[\w]{10}-[\w-]+$/.test(feed.journeyNo) ? feed.journeyNo.split('-')[0] : ''
                feed.createdDate = TimeUtils.correctUTC8Timestamp(orderItem.BasicInfo.DataChange_CreateTime)
                feed.extrasInfo = JSON.stringify(orderItem)
                bulkAdder.putObject(feed.fc_encode())
              }
            }
            if (record.FlightOrderInfoList) {
              offset += record.FlightOrderInfoList.length
              console.info(`[dumpCtripOrders] ${offset} / ${feeds.length}`)
              for (const orderItem of record.FlightOrderInfoList) {
                const coreChangeInfo =
                  Array.isArray(orderItem.FlightChangeInfo) &&
                  orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
                    ? orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
                    : null
                const feed = new CTrip_Order()
                feed.orderId = Number(orderItem.BasicInfo.OrderID)
                feed.orderType = HLY_OrderType.FLIGHT
                feed.employeeId = orderItem.BasicInfo.EmployeeID || null
                feed.userName = orderItem.BasicInfo.PreEmployName || ''
                feed.orderStatus = orderItem.BasicInfo.OrderStatus
                feed.changeStatus = ''
                if (coreChangeInfo) {
                  if (coreChangeInfo.FlightChangeType === CTrip_FlightChangeType.Canceled) {
                    feed.orderStatus = '航班取消'
                  } else if (
                    [
                      CTrip_FlightChangeType.Changed,
                      CTrip_FlightChangeType.Delayed,
                      CTrip_FlightChangeType.Recovery,
                    ].includes(coreChangeInfo.FlightChangeType)
                  ) {
                    feed.orderStatus = '航班变更'
                  }
                }
                feed.journeyNo = orderItem.BasicInfo.JourneyID || ''
                feed.businessCode =
                  feed.journeyNo && /^[\w]{10}-[\w-]+$/.test(feed.journeyNo) ? feed.journeyNo.split('-')[0] : ''
                feed.createdDate = TimeUtils.correctUTC8Timestamp(orderItem.BasicInfo.CreateTime)
                feed.extrasInfo = JSON.stringify(orderItem)
                bulkAdder.putObject(feed.fc_encode())
              }
            }
          }
          await bulkAdder.execute()
        }
      )
    }
  }

  public async extractTrainTicketsFromOrders() {
    const CTrip_Order = this.syncCore.modelsCore.CTrip_Order
    const CTrip_Ticket = this.syncCore.modelsCore.CTrip_Ticket
    const employeeIdToUserOidMapper = await this.syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await this.syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await this.syncCore.modelsCore.HLY_Staff.staffMapper()

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', CTrip_OrderType.TRAIN)
    const feeds = await searcher.queryFeeds()

    const dbSpec = new CTrip_Ticket().dbSpec()

    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((item) => !['business_code', 'deprecated_id'].includes(item))
    )
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')

    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_TrainOrderInfoEntity

      // console.info(`------------------- ${item.orderId} -------------------`)
      const ticketInfoList = extrasData.TicketInfoList
      // console.info(
      //   'Trains: ',
      //   ticketInfoList
      //     .map((item) => `${item.TrainName} ${item.DepartureDateTime} ~ ${item.ArrivalDateTime}`)
      //     .join(' | ')
      // )
      const hasChanged = !!ticketInfoList.find((item) => item.TrainTicketType === 'C')
      for (const passenger of extrasData.PassengerInfoList) {
        // console.info(passenger.EmployeeID, passenger.PassengerName)
        for (let i = 0; i < ticketInfoList.length; ++i) {
          const ticketInfo = ticketInfoList[i]
          const ticket = new CTrip_Ticket()
          ticket.orderType = item.orderType as HLY_OrderType
          ticket.orderId = item.orderId
          ticket.infoId = `${ticketInfo.ElectronicOrderNo}`
          ticket.employeeId = passenger.EmployeeID
          ticket.userName = passenger.PassengerName
          {
            ticket.userOid = employeeIdToUserOidMapper[ticket.employeeId] || ''
            if (
              !ticket.userOid &&
              nameToUserOidsMapper[ticket.userName] &&
              nameToUserOidsMapper[ticket.userName].length === 1
            ) {
              ticket.userOid = nameToUserOidsMapper[ticket.userName][0]
            }
            ticket.baseCity = ticket.userOid && staffMapper[ticket.userOid] ? staffMapper[ticket.userOid].baseCity : ''
          }
          ticket.journeyNo = item.journeyNo
          // ticket.businessCode = item.businessCode
          ticket.ctripStatus = item.orderStatus
          ticket.trafficCode = ticketInfo.TrainName
          ticket.fromTime = TimeUtils.correctUTC8Timestamp(ticketInfo.DepartureDateTime)
          ticket.toTime = TimeUtils.correctUTC8Timestamp(ticketInfo.ArrivalDateTime)
          ticket.fromCity = ticketInfo.DepartureCityName
          ticket.toCity = ticketInfo.ArrivalCityName
          ticket.ticketId = md5(
            [
              ticket.orderType,
              ticket.orderId,
              ticket.infoId,
              ticket.userOid || ticket.userName,
              ticket.trafficCode,
            ].join(',')
          )
          if (hasChanged && ticketInfo.TrainTicketType === 'D') {
            ticket.ctripStatus = '已改签'
          }
          if (
            item.orderStatus === '部分退票' &&
            passenger.OrderTicket &&
            passenger.OrderTicket.length === ticketInfoList.length
          ) {
            const ticketOrder = passenger.OrderTicket[i]
            ticket.ctripStatus = ticketOrder.RefundTicketStatus === 'S' ? '已退票' : '已购票'
          }
          bulkAdder.putObject(ticket.fc_encode())
        }
      }
    }
    await bulkAdder.execute()
  }

  public async extractFlightTicketsFromOrders() {
    const CTrip_Order = this.syncCore.modelsCore.CTrip_Order
    const CTrip_Ticket = this.syncCore.modelsCore.CTrip_Ticket
    const employeeIdToUserOidMapper = await this.syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await this.syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await this.syncCore.modelsCore.HLY_Staff.staffMapper()

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', CTrip_OrderType.FLIGHT)
    const feeds = await searcher.queryFeeds()

    const dbSpec = new CTrip_Ticket().dbSpec()

    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((item) => !['business_code', 'deprecated_id'].includes(item))
    )
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')

    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_FlightOrderInfoEntity
      // console.info(`------------------- ${item.orderId} -------------------`)
      const flightInfoList = extrasData.FlightInfo
      // console.info(
      //   'Flights: ',
      //   flightInfoList.map((item) => `${item.Flight} ${item.TakeoffTime} ~ ${item.ArrivalTime}`).join(' | ')
      // )
      for (const passenger of extrasData.PassengerInfo) {
        // console.info(passenger.PassengerBasic.CorpEid, passenger.PassengerBasic.PassengerName)
        for (let i = 0; i < flightInfoList.length; ++i) {
          const flightInfo = flightInfoList[i]
          const sequence = passenger.SequenceInfo[i]
          const ticket = new CTrip_Ticket()
          ticket.orderType = item.orderType as HLY_OrderType
          ticket.orderId = item.orderId
          ticket.infoId = ''
          ticket.employeeId = passenger.PassengerBasic.CorpEid
          ticket.userName = passenger.PassengerBasic.PassengerName
          {
            ticket.userOid = employeeIdToUserOidMapper[ticket.employeeId] || ''
            if (
              !ticket.userOid &&
              nameToUserOidsMapper[ticket.userName] &&
              nameToUserOidsMapper[ticket.userName].length === 1
            ) {
              ticket.userOid = nameToUserOidsMapper[ticket.userName][0]
            }
            ticket.baseCity = ticket.userOid && staffMapper[ticket.userOid] ? staffMapper[ticket.userOid].baseCity : ''
          }
          ticket.journeyNo = item.journeyNo
          ticket.businessCode = item.businessCode
          ticket.ctripStatus = item.orderStatus
          ticket.trafficCode = flightInfo.Flight
          ticket.fromTime = TimeUtils.correctUTC8Timestamp(flightInfo.TakeoffTime)
          ticket.toTime = TimeUtils.correctUTC8Timestamp(flightInfo.ArrivalTime)
          ticket.fromCity = flightInfo.DCityName
          ticket.toCity = flightInfo.ACityName
          ticket.ticketId = md5(
            [
              ticket.orderType,
              ticket.orderId,
              ticket.infoId,
              ticket.userOid || ticket.userName,
              ticket.trafficCode,
            ].join(',')
          )
          if (item.orderStatus === '已成交' && sequence.ChangeInfo) {
            ticket.ctripStatus = '已改签'
            bulkAdder.putObject(ticket.fc_encode())

            for (const changeInfo of sequence.ChangeInfo) {
              ticket.ctripStatus = item.orderStatus
              ticket.trafficCode = changeInfo.CFlight
              ticket.fromTime = TimeUtils.correctUTC8Timestamp(changeInfo.CTakeOffTime)
              ticket.toTime = TimeUtils.correctUTC8Timestamp(changeInfo.CArrivalTime)
              ticket.fromCity = changeInfo.CDCityName
              ticket.toCity = changeInfo.CACityName
              ticket.ticketId = md5(
                [
                  ticket.orderType,
                  ticket.orderId,
                  ticket.infoId,
                  ticket.userOid || ticket.userName,
                  ticket.trafficCode,
                ].join(',')
              )
              bulkAdder.putObject(ticket.fc_encode())
            }
          } else {
            bulkAdder.putObject(ticket.fc_encode())
          }
        }
      }
    }

    await bulkAdder.execute()
  }
}
