import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_EmployeeTrafficData, App_TravelCoreItinerary, HLY_ClosedLoopStatus, HLY_PrettyStatus } from '../core'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { Transaction } from 'fc-sql'

export class TravelFormHandler {
  public readonly modelsCore: HuilianyiModelsCore
  public readonly travelItem: _HLY_Travel

  constructor(modelsCore: HuilianyiModelsCore, travelItem: _HLY_Travel) {
    this.modelsCore = modelsCore
    this.travelItem = travelItem
  }

  public async updateTrafficItems(employeeTrafficItems: App_EmployeeTrafficData[], transaction?: Transaction) {
    const travelItem = this.travelItem
    const extrasData = travelItem.extrasData()
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
      closedLoopCount > 0 && closedLoopCount === extrasData.participants.length
        ? HLY_ClosedLoopStatus.HasClosedLoop
        : HLY_ClosedLoopStatus.NoneClosedLoop
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
      for (const ticketId of ticketIdList) {
        const ticketFeed = new this.modelsCore.HLY_TrafficTicket()
        ticketFeed.ticketId = ticketId
        ticketFeed.fc_edit()
        ticketFeed.useForAllowance = travelItem.matchClosedLoop ? 1 : 0
        await ticketFeed.updateToDB(transaction)
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
