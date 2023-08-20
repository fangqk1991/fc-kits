import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  App_EmployeeTrafficData,
  App_TrafficTicket,
  App_TravelCoreItinerary,
  App_TravelOrderExtras,
  HLY_ClosedLoopStatus,
  HLY_PrettyStatus,
  HLY_TravelStatus,
  TravelTools,
} from '../core'
import * as moment from 'moment'
import { SQLBulkAdder, SQLModifier, Transaction } from 'fc-sql'
import assert from '@fangcha/assert'
import { makeRandomStr } from '@fangcha/tools'
import { _Dummy_Travel } from '../models/extensions/_Dummy_Travel'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'

export class TravelService {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async getTravelTrafficItems(travelItem: _HLY_Travel, transaction?: Transaction) {
    const searcher = new this.modelsCore.HLY_Staff().fc_searcher()
    if (transaction) {
      searcher.processor().transaction = transaction
    }
    searcher.processor().addConditionKeyInArray('user_oid', travelItem.participantUserOids())
    const feeds = await searcher.queryAllFeeds()
    const staffMapper = feeds.reduce((result, cur) => {
      result[cur.userOid] = cur
      return result
    }, {} as { [p: string]: _HLY_Staff })

    const mapper = await this.getTravelTrafficItemsMapper([travelItem], staffMapper, transaction)
    return mapper[travelItem.businessCode]
  }

  public async getTravelTrafficItemsMapper(
    travelItems: _HLY_Travel[],
    staffMapper: { [p: string]: _HLY_Staff },
    transaction?: Transaction
  ) {
    const HLY_TrafficTicket = this.modelsCore.HLY_TrafficTicket

    const businessCodeList = travelItems.map((item) => item.businessCode)

    const businessTrafficItemsMapper: {
      [businessCode: string]: App_EmployeeTrafficData[]
    } = {}

    {
      const travelEmployeeDataMapper: {
        [businessCode: string]: {
          [employeeName: string]: App_EmployeeTrafficData
        }
      } = {}
      for (const businessCode of businessCodeList) {
        travelEmployeeDataMapper[businessCode] = {}
      }
      const searcher = new HLY_TrafficTicket().fc_searcher()
      if (transaction) {
        searcher.processor().transaction = transaction
      }
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      searcher.processor().addConditionKV('is_valid', 1)
      searcher.processor().addOrderRule('from_time', 'ASC')
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const commonTicket = item.modelForClient() as App_TrafficTicket
        const employeeTrafficDataMapper = travelEmployeeDataMapper[commonTicket.businessCode]
        const userId = commonTicket.userOid || commonTicket.userName
        if (!employeeTrafficDataMapper[userId]) {
          employeeTrafficDataMapper[userId] = {
            userOid: commonTicket.userOid,
            employeeId: commonTicket.employeeId,
            employeeName: commonTicket.userName,
            isClosedLoop: false,
            tickets: [],
            closedLoops: [],
            allowanceDayItems: [],
          }
        }
        employeeTrafficDataMapper[userId].tickets.push(commonTicket)
      }
      for (const businessCode of businessCodeList) {
        businessTrafficItemsMapper[businessCode] = Object.values(travelEmployeeDataMapper[businessCode])
      }
    }

    const calculator = await this.modelsCore.HLY_AllowanceRule.calculator()

    for (const businessCode of businessCodeList) {
      const trafficItems = businessTrafficItemsMapper[businessCode]
      for (const trafficData of trafficItems) {
        trafficData.tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())
        const closedLoops = TravelTools.makeClosedLoopsV2(trafficData.tickets)
        if (closedLoops.length === 0) {
          trafficData.isClosedLoop = false
          continue
        }
        trafficData.isClosedLoop = true
        trafficData.closedLoops = closedLoops

        const staff = staffMapper[trafficData.userOid]
        if (!staff) {
          console.error(`staff[${trafficData.userOid}] missing.`)
          continue
        }
        trafficData.allowanceDayItems = calculator.calculateAllowanceDayItems(staff.groupCodes(), closedLoops)
      }
    }
    return businessTrafficItemsMapper
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

  public async fillTravelOrdersCTripStatus() {
    await this.modelsCore.database.update(`
        UPDATE hly_order_flight, ctrip_order
        SET hly_order_flight.ctrip_status = ctrip_order.order_status
        WHERE hly_order_flight.hly_id = ctrip_order.order_id
    `)
    await this.modelsCore.database.update(`
      UPDATE hly_order_train, ctrip_order 
      SET hly_order_train.ctrip_status = ctrip_order.order_status 
      WHERE hly_order_train.hly_id = ctrip_order.order_id
    `)
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
    const linkedTicketMap: { [ticketId: string]: string } = {}
    {
      const searcher = new this.modelsCore.Dummy_Travel().fc_searcher()
      searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
      const feeds = await searcher.queryAllFeeds()
      for (const dummyTravel of feeds) {
        for (const ticketId of dummyTravel.ticketIdList()) {
          linkedTicketMap[ticketId] = dummyTravel.businessCode
        }
      }
    }

    const todoTickets: App_TrafficTicket[] = []
    {
      const searcher = new this.modelsCore.HLY_OrderFlight().fc_searcher()
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const extrasData = item.extrasData() as App_TravelOrderExtras
        const commonTickets = extrasData.commonTickets
        commonTickets.forEach((ticket) => {
          ticket.businessCode = linkedTicketMap[ticket.ticketId] || ticket.businessCode || item.businessCode || ''
          const orderStatus = item.ctripStatus || item.orderStatus
          ticket.ctripStatus = orderStatus
          ticket.ctripValid = orderStatus === '已成交' ? 1 : 0
        })
        todoTickets.push(...commonTickets)
      }
    }
    {
      const searcher = new this.modelsCore.HLY_OrderTrain().fc_searcher()
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const extrasData = item.extrasData() as App_TravelOrderExtras
        const commonTickets = extrasData.commonTickets
        commonTickets.forEach((ticket) => {
          ticket.businessCode = linkedTicketMap[ticket.ticketId] || ticket.businessCode || item.businessCode || ''
          const orderStatus = item.ctripStatus || item.orderStatus
          ticket.ctripStatus = orderStatus
          ticket.ctripValid = ['已购票', '待出票'].includes(orderStatus) ? 1 : 0
        })
        todoTickets.push(...commonTickets)
      }
    }

    const dbSpec = new this.modelsCore.HLY_TrafficTicket().dbSpec()
    const runner = dbSpec.database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.transaction = transaction
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(
        dbSpec
          .insertableCols()
          .filter((item) => !['is_dummy', 'is_valid', 'custom_valid', 'use_for_allowance', 'remarks'].includes(item))
      )
      bulkAdder.declareTimestampKey('from_time')
      bulkAdder.declareTimestampKey('to_time')
      for (const ticketData of todoTickets) {
        const feed = new this.modelsCore.HLY_TrafficTicket()
        feed.fc_generateWithModel(ticketData)
        feed.isEditable = !['紧急预订', '紧急预定'].includes(ticketData.journeyNo) && ticketData.businessCode ? 0 : 1
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()

      {
        const modifier = new SQLModifier(dbSpec.database)
        modifier.transaction = transaction
        modifier.setTable(dbSpec.table)
        modifier.updateExpression('is_valid = IFNULL(custom_valid, ctrip_valid)')
        modifier.addConditionKV('is_dummy', 0)
        await modifier.execute()
      }
      {
        const modifier = new SQLModifier(dbSpec.database)
        modifier.transaction = transaction
        modifier.setTable(dbSpec.table)
        modifier.updateKV('use_for_allowance', 0)
        modifier.addConditionKV('is_valid', 0)
        await modifier.execute()
      }
    })
  }

  public async getTicketBusinessCodeList() {
    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().markDistinct()
    searcher.processor().setColumns(['business_code'])
    searcher.processor().addSpecialCondition('business_code != ?', '')
    const feeds = await searcher.queryAllFeeds()
    return feeds.map((feed) => feed.businessCode)
  }

  public async deleteDummyTravel(businessCode: string) {
    const dummyTravel = await this.modelsCore.Dummy_Travel.findWithBusinessCode(businessCode)
    assert.ok(
      !!dummyTravel && dummyTravel.travelStatus !== HLY_TravelStatus.Deleted,
      `虚拟申请单[${businessCode}]不存在`
    )

    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().addConditionKV('business_code', businessCode)
    const tickets = await searcher.queryAllFeeds()

    const runner = dummyTravel.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await dummyTravel.deleteFromDB(transaction)
      for (const ticket of tickets) {
        ticket.fc_edit()
        ticket.businessCode = ''
        await ticket.updateToDB(transaction)
      }
    })
  }

  public async clearTicketsBusinessCode(ticketIdList: string[]) {
    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().addConditionKeyInArray('ticket_id', ticketIdList)
    const tickets = await searcher.queryAllFeeds()

    const todoTravelList: _Dummy_Travel[] = []
    for (const ticketId of ticketIdList) {
      const searcher = new this.modelsCore.Dummy_Travel().fc_searcher()
      searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
      searcher.processor().addSpecialCondition('FIND_IN_SET(?, ticket_id_list_str)', ticketId)
      const items = await searcher.queryAllFeeds()
      todoTravelList.push(...items)
    }

    const runner = new this.modelsCore.HLY_TrafficTicket().dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const ticket of tickets) {
        await ticket.unlinkBusinessCode(transaction)
      }
      for (const dummyTravel of todoTravelList) {
        dummyTravel.fc_edit()
        dummyTravel.travelStatus = HLY_TravelStatus.Deleted
        await dummyTravel.updateToDB(transaction)
      }
    })
  }

  public async makeDummyTravel(ticketIdList: string[], remarks?: string) {
    assert.ok(Array.isArray(ticketIdList), `参数有误`)
    assert.ok(ticketIdList.length > 0, `未选择票据`)
    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().addConditionKeyInArray('ticket_id', ticketIdList)
    searcher.processor().addOrderRule('from_time', 'ASC')
    const tickets = await searcher.queryFeeds()
    if (tickets.length !== ticketIdList.length) {
      for (const ticketId of ticketIdList) {
        assert.ok(!!tickets.find((ticket) => ticket.ticketId === ticketId), `Ticket[${ticketId}] missing.`)
      }
    }
    const userOid = tickets[0].userOid
    tickets.forEach((ticket) => {
      assert.ok(!!ticket.isValid, `所选票据中存在无效票据`)
      assert.ok(!ticket.businessCode, `所选票据中存在已关联出差申请单的票据`)
      assert.ok(userOid === ticket.userOid, `所选票据并非来自同一人`)
    })
    for (const ticketId of ticketIdList) {
      const searcher = new this.modelsCore.Dummy_Travel().fc_searcher()
      searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
      searcher.processor().addSpecialCondition('FIND_IN_SET(?, ticket_id_list_str)', ticketId)
      assert.ok((await searcher.queryCount()) === 0, `票据[${ticketId}]已被其他虚拟行程单关联`, 500)
    }

    const closedLoops = TravelTools.makeClosedLoopsV2(tickets.map((item) => item.modelForClient()))
    assert.ok(closedLoops.length > 0, `所选票据未构成闭环行程`)

    const staff = (await this.modelsCore.HLY_Staff.findWithUid(userOid))!
    assert.ok(!!staff, `相关员工不存在`)

    const dummyTravel = new this.modelsCore.Dummy_Travel()
    dummyTravel.businessCode = makeRandomStr(20)
    dummyTravel.applicantOid = staff.userOid
    dummyTravel.applicantName = staff.fullName
    dummyTravel.startTime = tickets[0].fromTime
    dummyTravel.endTime = tickets[tickets.length - 1].toTime
    dummyTravel.travelStatus = HLY_TravelStatus.Passed
    dummyTravel.ticketIdListStr = tickets.map((item) => item.ticketId).join(',')
    dummyTravel.remarks = remarks || ''
    const runner = dummyTravel.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await dummyTravel.addToDB(transaction)
      dummyTravel.fc_edit()
      dummyTravel.businessCode = `V_${dummyTravel.hlyId}`
      await dummyTravel.updateToDB(transaction)
      for (const ticket of tickets) {
        await ticket.linkBusinessCode(dummyTravel.businessCode, transaction)
      }
    })
    return dummyTravel
  }

  public async refreshTravelTicketItemsData() {
    const businessCodeList = await this.getTicketBusinessCodeList()
    console.info(`[refreshTravelTicketItemsData] ${businessCodeList.length} businessCode items`)

    const searcher = new this.modelsCore.HLY_Travel().fc_searcher()
    searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
    const todoItems = await searcher.queryAllFeeds()
    const staffMapper = await this.modelsCore.HLY_Staff.staffMapper()

    const mapper = await this.getTravelTrafficItemsMapper(todoItems, staffMapper)

    for (let i = 0; i < todoItems.length; ++i) {
      const travelItem = todoItems[i]
      console.info(`[refreshTravelTicketItemsData - ${travelItem.businessCode}] ${i} / ${todoItems.length}`)
      await this.updateTravelFormTrafficData(travelItem, mapper[travelItem.businessCode])
    }
  }

  public async refreshTravelTicketsInfo(travelItem: _HLY_Travel, transaction?: Transaction) {
    const trafficItems = await this.getTravelTrafficItems(travelItem, transaction)
    await this.updateTravelFormTrafficData(travelItem, trafficItems, transaction)
  }

  public async updateTravelFormTrafficData(
    travelItem: _HLY_Travel,
    employeeTrafficItems: App_EmployeeTrafficData[],
    transaction?: Transaction
  ) {
    const ticketIdList = Object.keys(
      employeeTrafficItems.reduce((result, cur) => {
        for (const ticket of cur.tickets) {
          result[ticket.ticketId] = true
        }
        return result
      }, {})
    )
    const closedLoopCount = employeeTrafficItems.filter((item) => item.isClosedLoop).length
    travelItem.fc_edit()
    travelItem.matchClosedLoop =
      closedLoopCount > 0 ? HLY_ClosedLoopStatus.HasClosedLoop : HLY_ClosedLoopStatus.NoneClosedLoop
    travelItem.isPretty = travelItem.matchClosedLoop ? HLY_PrettyStatus.Pretty : HLY_PrettyStatus.NotPretty
    travelItem.employeeTrafficItemsStr = JSON.stringify(employeeTrafficItems)
    travelItem.ticketIdListStr = ticketIdList.join(',')
    if (travelItem.isDummy) {
      const keyTickets = employeeTrafficItems[0] ? employeeTrafficItems[0].tickets : []
      const itineraryList: App_TravelCoreItinerary[] = keyTickets.map((ticket) => ({
        startDate: ticket.fromTime,
        endDate: ticket.toTime,
        fromCityName: ticket.fromCity,
        toCityName: ticket.toCity,
        subsidyList: [],
      }))
      travelItem.itineraryItemsStr = JSON.stringify(itineraryList)
    }
    const handler = async (transaction: Transaction) => {
      await travelItem.updateToDB(transaction)
      for (const trafficData of employeeTrafficItems) {
        for (const ticket of trafficData.tickets) {
          const ticketFeed = new this.modelsCore.HLY_TrafficTicket()
          ticketFeed.ticketId = ticket.ticketId
          ticketFeed.useForAllowance = null as any
          ticketFeed.fc_edit()
          ticketFeed.useForAllowance = ticket.useForAllowance || 0
          await ticketFeed.updateToDB(transaction)
        }
      }
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = travelItem.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
  }
}
