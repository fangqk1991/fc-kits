import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_FullTravelModel, App_TravelModel, TravelTicketsDataInfo } from '../core/App_CoreModels'
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
      }
    }
    {
      const searcher = new HLY_OrderFlight().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const tickets = item.modelForClient().extrasData.tickets
        ticketDataMapper[item.businessCode].flightTickets.push(...tickets)
        ticketDataMapper[item.businessCode].trafficTickets.push(
          ...tickets.map((ticket) => ({
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
        )
      }
    }
    {
      const searcher = new HLY_OrderTrain().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        const tickets = item.modelForClient().extrasData.tickets
        ticketDataMapper[item.businessCode].trainTickets.push(...tickets)
        ticketDataMapper[item.businessCode].trafficTickets.push(
          ...tickets.map((ticket) => ({
            tagName: '火车票',
            ticketId: ticket.trainOrderOID,
            trafficCode: ticket.trainName,
            fromTime: ticket.startDate,
            toTime: ticket.endDate,
            fromCity: ticket.departureCityName,
            toCity: ticket.arrivalCityName,
            employeeId: '',
            employeeName: ticket.passengerName || '',
          }))
        )
      }
    }
    for (const businessCode of businessCodeList) {
      ticketDataMapper[businessCode].trafficTickets.sort(
        (a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf()
      )
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
}
