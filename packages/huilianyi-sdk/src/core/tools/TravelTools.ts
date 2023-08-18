import * as moment from 'moment/moment'
import { App_ClosedLoop, App_TrafficTicket } from '../travel/App_TravelModels'

export class TravelTools {
  public static splitTickets(tickets: App_TrafficTicket[]) {
    tickets = [...tickets]
    tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())
    const fragments: App_TrafficTicket[][] = []
    if (tickets.length === 0) {
      return []
    }
    const baseCity = tickets[0].baseCity || tickets[0].fromCity
    let curTickets: App_TrafficTicket[] = []
    for (const ticket of tickets) {
      if (curTickets.length === 0 && ticket.fromCity !== baseCity) {
        continue
      }
      if (ticket.fromCity === baseCity) {
        curTickets = [ticket]
        continue
      }
      curTickets.push(ticket)
      if (ticket.toCity === baseCity) {
        fragments.push(curTickets)
        curTickets = []
      }
    }
    return fragments
  }

  public static makeClosedLoopsV2(tickets: App_TrafficTicket[]) {
    const ticketFragments = this.splitTickets(tickets)
    const closedLoops: App_ClosedLoop[] = []
    const calcLoopTickets = (
      curTickets: App_TrafficTicket[],
      remainTickets: App_TrafficTicket[]
    ): App_TrafficTicket[] | null => {
      const lastTicket = curTickets[curTickets.length - 1]
      if (remainTickets.length === 0) {
        return lastTicket.toCity === curTickets[0].fromCity ? curTickets : null
      }
      const [ticket2, ...remainTickets2] = remainTickets
      if (lastTicket.toCity !== ticket2.fromCity) {
        return calcLoopTickets([...curTickets], [...remainTickets2])
      }
      return (
        calcLoopTickets([...curTickets, ticket2], [...remainTickets2]) ||
        calcLoopTickets([...curTickets], [...remainTickets2])
      )
    }
    for (const tickets of ticketFragments) {
      const [firstTicket, ...remainTickets] = tickets
      const loopTickets = calcLoopTickets([firstTicket], remainTickets)
      if (loopTickets) {
        loopTickets.forEach((ticket) => (ticket.useForAllowance = 1))
        closedLoops.push({
          tickets: loopTickets,
        })
      }
    }
    return closedLoops
  }

  /**
   * @deprecated
   */
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
