import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  App_ClosedLoop,
  App_EmployeeTrafficData,
  App_TrafficTicket,
  HLY_ClosedLoopStatus,
  HLY_PrettyStatus,
  HLY_TravelParticipant,
  HLY_TravelStatus,
  TravelTicketsDataInfo,
} from '../core'
import * as moment from 'moment'
import { SQLBulkAdder } from 'fc-sql'

export class TravelService {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async getTravelTicketsData(businessCode: string) {
    const mapper = await this.getTicketsDataMapper([businessCode])
    return mapper[businessCode]
  }

  public async getTicketsDataMapper(businessCodeList: string[]) {
    const HLY_TrafficTicket = this.modelsCore.HLY_TrafficTicket

    const ticketDataMapper: { [businessCode: string]: TravelTicketsDataInfo } = {}
    for (const businessCode of businessCodeList) {
      ticketDataMapper[businessCode] = {
        trafficTickets: [],
        employeeTrafficData: {},
      }
    }
    {
      const searcher = new HLY_TrafficTicket().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      searcher.processor().addConditionKV('is_valid', 1)
      searcher.processor().addOrderRule('from_time', 'ASC')
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const commonTicket = item.modelForClient()
        const ticketData = ticketDataMapper[commonTicket.businessCode]
        ticketData.trafficTickets.push(commonTicket)
        if (!ticketData.employeeTrafficData[commonTicket.userName]) {
          ticketData.employeeTrafficData[commonTicket.userName] = {
            employeeId: commonTicket.employeeId,
            employeeName: commonTicket.userName,
            isClosedLoop: false,
            tickets: [],
            closedLoops: [],
            allowanceDayItems: [],
          }
        }
        ticketData.employeeTrafficData[commonTicket.userName].tickets.push(commonTicket)
      }
    }

    const calculator = await this.modelsCore.HLY_AllowanceRule.calculator()

    for (const businessCode of businessCodeList) {
      const ticketData = ticketDataMapper[businessCode]
      ticketData.trafficTickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())

      for (const trafficData of Object.values(ticketData.employeeTrafficData) as App_EmployeeTrafficData[]) {
        trafficData.tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())
        const closedLoops: App_ClosedLoop[] = [
          {
            tickets: [],
          },
        ]

        let isClosedLoop = true
        let startCity = ''
        let curCity = ''
        for (const ticket of trafficData.tickets) {
          const lastLoop = closedLoops[closedLoops.length - 1]
          lastLoop.tickets.push(ticket)

          if (!startCity) {
            startCity = ticket.fromCity
            curCity = ticket.fromCity
          }

          if (ticket.fromCity !== curCity) {
            isClosedLoop = false
            break
          }

          if (startCity === ticket.toCity) {
            closedLoops.push({
              tickets: [],
            })
            startCity = ''
            curCity = ''
            continue
          }
          curCity = ticket.toCity
        }
        trafficData.isClosedLoop = isClosedLoop && curCity === startCity
        if (!trafficData.isClosedLoop) {
          continue
        }

        if (closedLoops[closedLoops.length - 1].tickets.length === 0) {
          closedLoops.pop()
        }
        trafficData.closedLoops = closedLoops

        const travelItem = (await this.modelsCore.HLY_Travel.findWithBusinessCode(businessCode))!
        if (!travelItem) {
          console.error(`TravelItem[${businessCode}] missing.`)
          continue
        }

        const staffMap = travelItem.extrasData().participants.reduce((result, cur) => {
          result[cur.fullName] = cur
          return result
        }, {} as { [name: string]: HLY_TravelParticipant })

        const simpleStaff = staffMap[trafficData.employeeName]
        if (!simpleStaff) {
          console.error(`employeeName[${trafficData.employeeName}] missing.`)
          continue
        }
        const staff = (await this.modelsCore.HLY_Staff.findWithUid(simpleStaff.userOID))!
        if (!staff) {
          console.error(`staff[${simpleStaff.userOID}] missing.`)
          continue
        }
        trafficData.allowanceDayItems = calculator.calculateAllowanceDayItems(staff.groupCodes(), closedLoops)
      }
    }
    return ticketDataMapper
  }

  public async refreshTravelParticipants() {
    const searcher = new this.modelsCore.HLY_Travel().fc_searcher()
    searcher
      .processor()
      .addSpecialCondition(
        'NOT EXISTS (SELECT hly_travel_participant.business_code FROM hly_travel_participant WHERE hly_travel_participant.business_code = hly_travel.business_code)'
      )
    const travelItems = await searcher.queryAllFeeds()
    console.info(`[refreshTravelParticipants] ${travelItems.length} TODO travelItems`)
    for (const travelItem of travelItems) {
      const oidList = travelItem.participantUserOids()
      for (const userOid of oidList) {
        const feed = new this.modelsCore.HLY_TravelParticipant()
        feed.businessCode = travelItem.businessCode
        feed.userOid = userOid
        await feed.strongAddToDB()
      }
    }
  }

  public async fillTravelOrdersBusinessCode() {
    {
      const items = (await this.modelsCore.database.query(`
        SELECT hly_order_flight.hly_id   AS hlyId,
               hly_travel.business_code AS businessCode
        FROM hly_travel_participant
                 INNER JOIN hly_travel ON hly_travel_participant.business_code = hly_travel.business_code
                 INNER JOIN hly_order_flight
                            ON FIND_IN_SET(hly_travel_participant.user_oid, hly_order_flight.ticket_user_oids_str)
                                AND hly_order_flight.start_time BETWEEN hly_travel.start_time AND hly_travel.end_time
        WHERE hly_order_flight.journey_no IN ('紧急预订', '紧急预定')
          AND hly_order_flight.business_code IS NULL
          AND order_status NOT IN ('出票失败', '已取消')
          AND hly_travel.travel_status NOT IN (${HLY_TravelStatus.Deleted})
    `)) as { hlyId: number; businessCode: string }[]
      console.info(`TODO FlightOrder: ${items.length} items`)
      for (const item of items) {
        const order = new this.modelsCore.HLY_OrderFlight()
        order.hlyId = item.hlyId
        order.fc_edit()
        order.businessCode = item.businessCode
        await order.updateToDB()
      }
    }
    {
      const items = (await this.modelsCore.database.query(`
        SELECT hly_order_train.hly_id   AS hlyId,
               hly_travel.business_code AS businessCode
        FROM hly_travel_participant
                 INNER JOIN hly_travel ON hly_travel_participant.business_code = hly_travel.business_code
                 INNER JOIN hly_order_train
                            ON FIND_IN_SET(hly_travel_participant.user_oid, hly_order_train.ticket_user_oids_str)
                                AND hly_order_train.start_time BETWEEN hly_travel.start_time AND hly_travel.end_time
        WHERE hly_order_train.journey_no IN ('紧急预订', '紧急预定')
          AND hly_order_train.business_code IS NULL
          AND order_status NOT IN ('出票失败', '已取消')
          AND hly_travel.travel_status NOT IN (${HLY_TravelStatus.Deleted})
    `)) as { hlyId: number; businessCode: string }[]
      console.info(`TODO TrainOrder: ${items.length} items`)
      for (const item of items) {
        const order = new this.modelsCore.HLY_OrderTrain()
        order.hlyId = item.hlyId
        order.fc_edit()
        order.businessCode = item.businessCode
        // const extrasData = order.extrasData()
        // extrasData.commonTickets.forEach((ticket) => (ticket.businessCode = item.businessCode))
        // order.extrasInfo = JSON.stringify(extrasData)
        await order.updateToDB()
      }
    }
  }

  public async makeCommonTrafficTickets() {
    const todoTickets: App_TrafficTicket[] = []
    {
      const searcher = new this.modelsCore.HLY_OrderFlight().fc_searcher()
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const commonTickets = item.extrasData().commonTickets
        commonTickets.forEach((ticket) => (ticket.businessCode = ticket.businessCode || item.businessCode || ''))
        todoTickets.push(...commonTickets)
      }
    }
    {
      const searcher = new this.modelsCore.HLY_OrderTrain().fc_searcher()
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const commonTickets = item.extrasData().commonTickets
        commonTickets.forEach((ticket) => (ticket.businessCode = ticket.businessCode || item.businessCode || ''))
        todoTickets.push(...commonTickets)
      }
    }
    const dbSpec = new this.modelsCore.HLY_TrafficTicket().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')
    for (const ticketData of todoTickets) {
      const feed = new this.modelsCore.HLY_TrafficTicket()
      feed.fc_generateWithModel(ticketData)
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }

  public async getTicketBusinessCodeList() {
    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().markDistinct()
    searcher.processor().setColumns(['business_code'])
    searcher.processor().addSpecialCondition('business_code IS NOT NULL AND business_code != ?', '')
    const feeds = await searcher.queryAllFeeds()
    return feeds.map((feed) => feed.businessCode!)
  }

  public async refreshTravelTicketItemsData() {
    const businessCodeList = await this.getTicketBusinessCodeList()
    console.info(`[refreshTravelTicketItemsData] ${businessCodeList.length} businessCode items`)

    const mapper = await this.getTicketsDataMapper(businessCodeList)

    const searcher = new this.modelsCore.HLY_Travel().fc_searcher()
    searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
    const todoItems = await searcher.queryAllFeeds()

    for (let i = 0; i < todoItems.length; ++i) {
      const travelItem = todoItems[i]
      console.info(`[refreshTravelTicketItemsData] ${i} / ${todoItems.length}`)
      const extrasData = travelItem.extrasData()
      const ticketData = mapper[travelItem.businessCode]
      const employeeTrafficItems = Object.values(ticketData.employeeTrafficData)
      const closedLoopCount = employeeTrafficItems.filter((item) => item.isClosedLoop).length
      travelItem.fc_edit()
      travelItem.matchClosedLoop =
        closedLoopCount > 0 && closedLoopCount === extrasData.participants.length
          ? HLY_ClosedLoopStatus.HasClosedLoop
          : HLY_ClosedLoopStatus.NoneClosedLoop
      travelItem.isPretty =
        travelItem.matchClosedLoop && travelItem.hasSubsidy ? HLY_PrettyStatus.Pretty : HLY_PrettyStatus.NotPretty
      travelItem.employeeTrafficItemsStr = JSON.stringify(employeeTrafficItems)
      await travelItem.updateToDB()
    }
  }
}
