import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  App_ClosedLoop,
  App_EmployeeTrafficData,
  App_FullTravelModel,
  App_TrafficTicket,
  App_TravelModel,
  HLY_ClosedLoopStatus,
  HLY_PrettyStatus,
  HLY_TravelParticipant,
  TravelTicketsDataInfo,
} from '../core'
import * as moment from 'moment'

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
    const HLY_OrderFlight = this.modelsCore.HLY_OrderFlight
    const HLY_OrderTrain = this.modelsCore.HLY_OrderTrain

    const ticketDataMapper: { [businessCode: string]: TravelTicketsDataInfo } = {}
    for (const businessCode of businessCodeList) {
      ticketDataMapper[businessCode] = {
        flightTickets: [],
        trainTickets: [],
        trafficTickets: [],
        employeeTrafficData: {},
      }
    }
    {
      const searcher = new HLY_OrderFlight().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const tickets = item.modelForClient().extrasData.tickets
        const ticketData = ticketDataMapper[item.businessCode]
        const commonTickets = tickets.map((ticket) => ({
          tagName: '机票',
          ticketId: ticket.flightOrderOID,
          trafficCode: ticket.flightCode,
          fromTime: ticket.startDate,
          toTime: ticket.endDate,
          fromCity: ticket.startCity,
          toCity: ticket.endCity,
          employeeId: ticket.employeeId,
          employeeName: ticket.employeeName,
        }))
        ticketData.flightTickets.push(...tickets)
        ticketData.trafficTickets.push(...commonTickets)
        for (const ticket of commonTickets) {
          if (!ticketData.employeeTrafficData[ticket.employeeName]) {
            ticketData.employeeTrafficData[ticket.employeeName] = {
              employeeId: ticket.employeeId,
              employeeName: ticket.employeeName,
              isClosedLoop: false,
              tickets: [],
              closedLoops: [],
              allowanceDayItems: [],
            }
          }
          ticketData.employeeTrafficData[ticket.employeeName].tickets.push(ticket)
        }
      }
    }
    {
      const searcher = new HLY_OrderTrain().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const tickets = item.modelForClient().extrasData.tickets
        const ticketData = ticketDataMapper[item.businessCode]
        const commonTickets: App_TrafficTicket[] = []
        for (const ticket of tickets) {
          const nameList = (ticket.passengerName || '')
            .split(',')
            .map((item) => item.trim())
            .filter((item) => !!item)
          for (const passengerName of nameList) {
            commonTickets.push({
              tagName: '火车票',
              ticketId: ticket.trainOrderOID,
              trafficCode: ticket.trainName,
              fromTime: ticket.startDate,
              toTime: ticket.endDate,
              fromCity: ticket.departureCityName,
              toCity: ticket.arrivalCityName,
              employeeId: '',
              employeeName: passengerName,
            })
          }
        }
        ticketData.trainTickets.push(...tickets)
        ticketData.trafficTickets.push(...commonTickets)
        for (const ticket of commonTickets) {
          if (!ticketData.employeeTrafficData[ticket.employeeName]) {
            ticketData.employeeTrafficData[ticket.employeeName] = {
              employeeId: ticket.employeeId,
              employeeName: ticket.employeeName,
              isClosedLoop: false,
              tickets: [],
              closedLoops: [],
              allowanceDayItems: [],
            }
          }
          ticketData.employeeTrafficData[ticket.employeeName].tickets.push(ticket)
        }
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

  public async getFullTravelInfos(travelItems: App_TravelModel[]) {
    const mapper = await this.getTicketsDataMapper(travelItems.map((item) => item.businessCode))
    return travelItems.map((item) => {
      const data: App_FullTravelModel = {
        ...item,
        ticketsData: mapper[item.businessCode],
      }
      data.extrasData.itineraryMap = {}
      return data
    })
  }

  public async refreshTravelTicketItemsData() {
    const businessCodeList: string[] = []
    {
      const searcher = new this.modelsCore.HLY_OrderFlight().fc_searcher()
      searcher.processor().markDistinct()
      searcher.processor().setColumns(['business_code'])
      searcher.processor().addSpecialCondition('business_code IS NOT NULL')
      const feeds = await searcher.queryAllFeeds()
      businessCodeList.push(...feeds.map((feed) => feed.businessCode))
    }
    {
      const searcher = new this.modelsCore.HLY_OrderTrain().fc_searcher()
      searcher.processor().markDistinct()
      searcher.processor().setColumns(['business_code'])
      searcher.processor().addSpecialCondition('business_code IS NOT NULL')
      const feeds = await searcher.queryAllFeeds()
      businessCodeList.push(...feeds.map((feed) => feed.businessCode))
    }
    const mapper = await this.getTicketsDataMapper(businessCodeList)

    const searcher = new this.modelsCore.HLY_Travel().fc_searcher()
    searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
    const todoItems = await searcher.queryAllFeeds()

    for (const travelItem of todoItems) {
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
