import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  App_EmployeeTrafficData,
  App_TrafficTicket,
  App_TravelCoreItinerary,
  HLY_ClosedLoopStatus,
  HLY_PrettyStatus,
  HLY_TravelStatus,
  TimeUtils,
  TravelTools,
} from '../core'
import * as moment from 'moment'
import { SQLBulkAdder, SQLModifier, Transaction } from 'fc-sql'
import assert from '@fangcha/assert'
import { makeRandomStr, md5 } from '@fangcha/tools'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'
import { _HLY_TrafficTicket } from '../models/extensions/_HLY_TrafficTicket'

interface SimpleTravel {
  businessCode: string
  createdDate: string
  isNewest?: number
}

interface OverlappedTravel {
  businessCode: string
  isNewest: number
  overlappedCodes: string[]
}

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
        trafficData.allowanceDayItems = calculator.calculateAllowanceDayItems(
          {
            roleCodeList: staff.groupCodes(),
            withoutAllowance: staff.withoutAllowance,
          },
          closedLoops
        )
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

  public async refreshOverlappedFlags() {
    const items = await this.findOverlappedTravelForms()
    const itemsMap = items.reduce((result, cur) => {
      result[cur.businessCode] = cur
      return result
    }, {} as { [p: string]: OverlappedTravel })

    const HLY_Travel = this.modelsCore.HLY_Travel
    const dbSpec = new HLY_Travel().dbSpec()

    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKeyInArray(
      'business_code',
      items.map((item) => item.businessCode)
    )
    const todoItems = await searcher.queryAllFeeds()

    const runner = dbSpec.database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      const modifier = new SQLModifier(dbSpec.database)
      modifier.transaction = transaction
      modifier.setTable(dbSpec.table)
      modifier.updateKV('has_repeated', 0)
      modifier.updateKV('is_newest', 0)
      modifier.updateKV('overlapped_codes_str', '')
      modifier.addSpecialCondition('1 = 1')
      await modifier.execute()

      for (const item of todoItems) {
        const data = itemsMap[item.businessCode]
        item.fc_edit()
        item.hasRepeated = 1
        item.isNewest = data.isNewest
        item.overlappedCodesStr = data.overlappedCodes.join(',')
        await item.updateToDB(transaction)
      }
    })
  }

  public async findOverlappedTravelForms() {
    const items = (await this.modelsCore.database.query(`
        SELECT travel_a.business_code AS codeA,
               travel_a.created_date  AS timeA,
               travel_b.business_code AS codeB,
               travel_b.created_date  AS timeB
        FROM hly_travel AS travel_a
                 INNER JOIN hly_travel AS travel_b
                            ON travel_a.participant_user_oids_str = travel_b.participant_user_oids_str
                                AND travel_a.hly_id != travel_b.hly_id
            AND (travel_a.start_time BETWEEN travel_b.start_time
                     AND travel_b.end_time
                OR travel_a.end_time BETWEEN travel_b.start_time
                     AND travel_b.end_time)
        WHERE travel_a.is_dummy = 0
          AND travel_a.travel_status = ${HLY_TravelStatus.Passed}
          AND travel_b.is_dummy = 0
          AND travel_b.travel_status = ${HLY_TravelStatus.Passed}
    `)) as { codeA: string; timeA: string; codeB: string; timeB: string }[]
    const overlappedMap: {
      [businessCode: string]: {
        self: SimpleTravel
        others: SimpleTravel[]
      }
    } = {}
    for (const item of items) {
      if (!overlappedMap[item.codeA]) {
        overlappedMap[item.codeA] = {
          self: {
            businessCode: item.codeA,
            isNewest: 1,
            createdDate: item.timeA,
          },
          others: [],
        }
      }
      if (moment(item.timeB).valueOf() > moment(item.timeA).valueOf()) {
        overlappedMap[item.codeA].self.isNewest = 0
      }
      overlappedMap[item.codeA].others.push({
        businessCode: item.codeB,
        createdDate: item.timeB,
      })
    }
    const groups: OverlappedTravel[] = Object.keys(overlappedMap).map((key) => {
      const item = overlappedMap[key]
      for (const otherItem of item.others) {
        if (moment(otherItem.createdDate).valueOf() > moment(item.self.createdDate).valueOf()) {
          item.self.isNewest = 0
        }
      }
      return {
        businessCode: item.self.businessCode,
        isNewest: item.self.isNewest || 0,
        overlappedCodes: item.others.map((t) => t.businessCode),
      }
    })
    return groups
  }

  public async fillCTripTicketsBusinessCode() {
    await this.modelsCore.database.update(`
        UPDATE ctrip_order, ctrip_ticket
        SET ctrip_ticket.business_code = ctrip_order.business_code
        WHERE ctrip_ticket.order_id = ctrip_order.order_id AND ctrip_order.business_code != ''
    `)
    await this.modelsCore.database.update(`
      UPDATE ctrip_ticket, hly_travel
      SET ctrip_ticket.business_code = hly_travel.business_code
      WHERE ctrip_ticket.journey_no IN ('紧急预订', '紧急预定', '')
        AND ctrip_ticket.business_code = ''
        AND ctrip_ticket.ctrip_status IN ('已购票', '待出票', '已成交', '航班变更')
        AND FIND_IN_SET(ctrip_ticket.user_oid, hly_travel.participant_user_oids_str)
        AND DATE (ctrip_ticket.from_time) BETWEEN DATE (hly_travel.start_time) AND DATE (hly_travel.end_time)
        AND hly_travel.travel_status NOT IN (${HLY_TravelStatus.Init}, ${HLY_TravelStatus.Deleted})
      `)
  }

  public async makeCommonTrafficTickets() {
    const searcher = new this.modelsCore.CTrip_Ticket().fc_searcher()
    const feeds = await searcher.queryAllFeeds()
    const todoTickets: App_TrafficTicket[] = feeds.map((item) => item.makeCommonTicket())

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
          .filter(
            (item) =>
              ![
                'is_dummy',
                'is_valid',
                'business_code',
                'custom_code',
                'custom_valid',
                'use_for_allowance',
                'remarks',
              ].includes(item)
          )
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
        modifier.updateExpression('business_code = IF(custom_code = "", hly_code, custom_code)')
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
    const codeList: string[] = []
    {
      const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
      searcher.processor().markDistinct()
      searcher.processor().setColumns(['business_code'])
      searcher.processor().addSpecialCondition('business_code != ?', '')
      const feeds = await searcher.queryAllFeeds()
      codeList.push(...feeds.map((feed) => feed.businessCode))
    }
    {
      const searcher = new this.modelsCore.HLY_Travel().fc_searcher()
      searcher.processor().setColumns(['business_code'])
      searcher.processor().addSpecialCondition('ticket_id_list_str != ?', '')
      const feeds = await searcher.queryAllFeeds()
      codeList.push(...feeds.map((feed) => feed.businessCode))
    }
    return [...new Set(codeList)]
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

    const runner = new this.modelsCore.HLY_TrafficTicket().dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const ticket of tickets) {
        await ticket.unlinkBusinessCode(transaction)
      }
    })
  }

  public async makeDummyTravel(ticketIdList: string[], options: { remarks?: string; specialKey?: string } = {}) {
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

    // const closedLoops = TravelTools.makeClosedLoopsV2(tickets.map((item) => item.modelForClient()))
    // assert.ok(closedLoops.length > 0, `所选票据未构成闭环行程`)

    const staff = (await this.modelsCore.HLY_Staff.findWithUid(userOid))!
    assert.ok(!!staff, `相关员工不存在`)

    const dummyTravel = new this.modelsCore.Dummy_Travel()
    dummyTravel.businessCode = makeRandomStr(20)
    dummyTravel.applicantOid = staff.userOid
    dummyTravel.applicantName = staff.fullName
    dummyTravel.startTime = tickets[0].fromTime
    dummyTravel.endTime = tickets[tickets.length - 1].toTime
    dummyTravel.travelStatus = HLY_TravelStatus.Passed
    dummyTravel.remarks = options.remarks || ''
    if (options.specialKey) {
      dummyTravel.specialKey = options.specialKey
    }
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
    console.info(`DummyTravel[${dummyTravel.businessCode}] created.`)
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

  public async createDummyTravelsByLonelyTickets() {
    const ticketsData = await this.findLonelyTicketsData()
    for (const month of Object.keys(ticketsData)) {
      for (const userOid of Object.keys(ticketsData[month])) {
        const tickets = ticketsData[month][userOid]
        const specialKey = md5([month, userOid].join(','))

        const dummyTravel = await this.modelsCore.Dummy_Travel.findOne({
          special_key: specialKey,
        })
        if (dummyTravel) {
          console.error(
            `${dummyTravel.businessCode} - ${dummyTravel.applicantOid} - ${month} - ${dummyTravel.applicantName} exists`
          )
          continue
        }
        await this.makeDummyTravel(
          tickets.map((ticket) => ticket.ticketId),
          {
            specialKey: specialKey,
            remarks: `${tickets[0].userName} ${month} 虚拟申请单`,
          }
        )
      }
    }
  }

  public async findLonelyTicketsData() {
    const searcher = new this.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().addConditionKV('is_valid', 1)
    searcher.processor().addConditionKV('business_code', '')
    searcher.processor().addConditionKV('hly_code', '')
    searcher.processor().addSpecialCondition('user_oid != ?', '')
    searcher.processor().addOrderRule('from_time', 'ASC')
    const tickets = await searcher.queryFeeds()

    console.info(`${tickets.length} lonely tickets.`)

    const ticketsData: {
      [month: string]: {
        [userOid: string]: _HLY_TrafficTicket[]
      }
    } = {}

    for (const ticket of tickets) {
      if (!ticket.userOid) {
        continue
      }
      const month = TimeUtils.momentUTC8(ticket.fromTime!).format('YYYY-MM')
      if (!ticketsData[month]) {
        ticketsData[month] = {}
      }
      if (!ticketsData[month][ticket.userOid]) {
        ticketsData[month][ticket.userOid] = []
      }
      ticketsData[month][ticket.userOid].push(ticket)
    }
    return ticketsData
  }
}
