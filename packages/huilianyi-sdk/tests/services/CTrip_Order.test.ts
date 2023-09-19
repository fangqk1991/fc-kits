import { HuilianyiServiceDev } from './HuilianyiServiceDev'
import {
  CTrip_FlightChangeTypeDescriptor,
  CTrip_FlightOrderInfoEntity,
  CTrip_OrderType,
  CTrip_TrainOrderInfoEntity,
} from '@fangcha/ctrip-sdk'
import { md5 } from '@fangcha/tools'
import { TimeUtils } from '../../src'
import { SQLBulkAdder } from 'fc-sql'

describe('Test CTrip_Order.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`CTrip_Order`, async () => {
    const CTrip_Order = huilianyiService.modelsCore.CTrip_Order

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_status', '航班变更')
    const feeds = await searcher.queryFeeds()
    for (const item of feeds) {
      const changeInfo = item.flightChangeInfo()!
      console.info(
        `${CTrip_FlightChangeTypeDescriptor.describe(changeInfo.FlightChangeType)}: [${changeInfo.OriginFlight} ${
          changeInfo.OriginDPort
        } - ${changeInfo.OriginAPort}] ${changeInfo.OriginDdate} ~ ${changeInfo.OriginAdate} | [${
          changeInfo.ProtectFlight
        } ${changeInfo.ProtectDPort} - ${changeInfo.ProtectAPort}] ${changeInfo.ProtectDdate} ~ ${
          changeInfo.ProtectAdate
        }`
      )
      if (changeInfo.OriginFlight !== changeInfo.ProtectFlight) {
        console.info('===================')
      }
      // console.info(JSON.stringify(changeInfo, null, 2))
    }
  })

  it(`CTrip_Order - 2`, async () => {
    const CTrip_Order = huilianyiService.modelsCore.CTrip_Order

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKeyInArray('order_id', [])
    const feeds = await searcher.queryFeeds()
    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_TrainOrderInfoEntity
      console.info(`${item.orderId}`)
      for (const ticketInfo of extrasData.TicketInfoList) {
        if (ticketInfo.TrainTicketType === 'C') {
          console.info(`改签后: ${ticketInfo.TrainName} ${ticketInfo.DepartureDateTime}`)
        }
        if (ticketInfo.TrainTicketType === 'D') {
          console.info(`改签前: ${ticketInfo.TrainName} ${ticketInfo.DepartureDateTime}`)
        }
      }
    }
  })

  it(`CTrip_Order - 3`, async () => {
    const CTrip_Order = huilianyiService.modelsCore.CTrip_Order
    const CTrip_Ticket = huilianyiService.modelsCore.CTrip_Ticket

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', CTrip_OrderType.FLIGHT)
    const feeds = await searcher.queryFeeds()

    const dbSpec = new CTrip_Ticket().dbSpec()

    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')

    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_FlightOrderInfoEntity
      // if (extrasData.PassengerInfo.length <= 1) {
      //   continue
      // }
      // if (extrasData.FlightInfo.length <= 1) {
      //   continue
      // }

      console.info(`------------------- ${item.orderId} -------------------`)
      const flightInfoList = extrasData.FlightInfo
      console.info(
        'Flights: ',
        flightInfoList.map((item) => `${item.Flight} ${item.TakeoffTime} ~ ${item.ArrivalTime}`).join(' | ')
      )
      for (const passenger of extrasData.PassengerInfo) {
        console.info(passenger.PassengerBasic.CorpEid, passenger.PassengerBasic.PassengerName)
        for (let i = 0; i < flightInfoList.length; ++i) {
          const flightInfo = flightInfoList[i]
          const sequence = passenger.SequenceInfo[i]
          const ticket = new CTrip_Ticket()
          ticket.orderType = item.orderType!
          ticket.orderId = item.orderId
          ticket.infoId = ''
          ticket.employeeId = passenger.PassengerBasic.CorpEid
          ticket.userName = passenger.PassengerBasic.PassengerName
          ticket.journeyNo = item.journeyNo
          ticket.businessCode =
            item.journeyNo && /^[\w]{10}-[\w-]+$/.test(item.journeyNo) ? item.journeyNo.split('-')[0] : ''
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
              ticket.employeeId || ticket.userName,
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
                  ticket.employeeId || ticket.userName,
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
      // for (const ticketInfo of extrasData.FlightInfo) {
      //   if (ticketInfo.TrainTicketType === 'C') {
      //     console.info(`改签后: ${ticketInfo.TrainName} ${ticketInfo.DepartureDateTime}`)
      //   }
      //   if (ticketInfo.TrainTicketType === 'D') {
      //     console.info(`改签前: ${ticketInfo.TrainName} ${ticketInfo.DepartureDateTime}`)
      //   }
      // }
    }

    await bulkAdder.execute()
  })
})
