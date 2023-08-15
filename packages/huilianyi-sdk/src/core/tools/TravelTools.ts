import * as moment from 'moment/moment'
import { App_ClosedLoop, App_TrafficTicket } from '../travel/App_TravelModels'

export class TravelTools {
  public static splitTickets(tickets: App_TrafficTicket[]) {
    tickets = [...tickets]
    tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())
    const fragments: App_TrafficTicket[][] = []
    let curTickets: App_TrafficTicket[] = []
    for (const ticket of tickets) {
      if (curTickets.length === 0 && ticket.fromCity !== ticket.baseCity) {
        continue
      }
      if (ticket.fromCity === ticket.baseCity) {
        curTickets = [ticket]
        continue
      }
      curTickets.push(ticket)
      if (ticket.toCity === ticket.baseCity) {
        fragments.push(curTickets)
        curTickets = []
      }
    }
    return fragments
  }

  public static makeClosedLoops(tickets: App_TrafficTicket[]): App_ClosedLoop[] | null {
    tickets = [...tickets]
    tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())

    const closedLoops: App_ClosedLoop[] = [
      {
        tickets: [],
      },
    ]
    let isClosedLoop = true
    let startCity = ''
    let curCity = ''
    for (const ticket of tickets) {
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
    isClosedLoop = isClosedLoop && curCity === startCity
    if (!isClosedLoop) {
      return null
    }
    if (closedLoops[closedLoops.length - 1].tickets.length === 0) {
      closedLoops.pop()
    }
    return closedLoops
  }
}
