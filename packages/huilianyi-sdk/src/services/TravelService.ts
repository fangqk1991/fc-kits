import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  App_EmployeeTrafficData,
  App_FullTravelModel,
  App_TrafficTicket,
  App_TravelModel,
  TravelTicketsDataInfo,
} from '../core/App_CoreModels'
import * as moment from 'moment'
import { HLY_PrettyStatus } from '../core/HLY_PrettyStatus'
import { HLY_ClosedLoopStatus } from '../core/HLY_ClosedLoopStatus'

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
            }
          }
          ticketData.employeeTrafficData[ticket.employeeName].tickets.push(ticket)
        }
      }
    }
    for (const businessCode of businessCodeList) {
      const ticketData = ticketDataMapper[businessCode]
      ticketData.trafficTickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())

      for (const trafficData of Object.values(ticketData.employeeTrafficData) as App_EmployeeTrafficData[]) {
        trafficData.tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())

        let isClosedLoop = true
        let startCity = ''
        let curCity = ''
        for (const ticket of trafficData.tickets) {
          if (!startCity) {
            startCity = ticket.fromCity
            curCity = ticket.fromCity
          }

          if (ticket.fromCity !== curCity) {
            isClosedLoop = false
            break
          }

          if (startCity === ticket.toCity) {
            startCity = ''
            curCity = ''
            continue
          }
          curCity = ticket.toCity
        }
        trafficData.isClosedLoop = isClosedLoop && curCity === startCity
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
      travelItem.fc_edit()
      travelItem.matchClosedLoop =
        employeeTrafficItems.map((item) => item.isClosedLoop).length === extrasData.participants.length
          ? HLY_ClosedLoopStatus.HasClosedLoop
          : HLY_ClosedLoopStatus.NoneClosedLoop
      travelItem.isPretty =
        travelItem.matchClosedLoop && travelItem.hasSubsidy ? HLY_PrettyStatus.Pretty : HLY_PrettyStatus.NotPretty
      travelItem.employeeTrafficItemsStr = JSON.stringify(employeeTrafficItems)
      await travelItem.updateToDB()
    }
  }
}
