import * as moment from 'moment/moment'
import { App_AllowanceCoreData, App_TicketsFragment, App_TrafficTicket } from '../travel/App_TravelModels'
import { AllowanceCoreTicket, AllowanceDayItem } from '../allowance/App_AllowanceModels'

export class TravelTools {
  public static splitTickets<T extends AllowanceCoreTicket>(tickets: T[]) {
    tickets = [...tickets]
    tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())
    if (tickets.length === 0) {
      return {
        loopTicketGroups: [],
        otherTicketGroups: [],
      }
    }
    const baseCity = tickets[0].baseCity || tickets[0].fromCity

    let leftIndex = 0
    let rightIndex = 0
    const loopRanges: { left: number; right: number }[] = []
    let otherRanges: { left: number; right: number }[] = []
    while (leftIndex < tickets.length && rightIndex < tickets.length) {
      while (leftIndex < tickets.length && tickets[leftIndex].fromCity !== baseCity) {
        ++leftIndex
      }
      if (leftIndex === tickets.length) {
        break
      }

      rightIndex = leftIndex
      while (rightIndex < tickets.length && tickets[rightIndex].toCity !== baseCity) {
        if (tickets[rightIndex].fromCity == baseCity) {
          leftIndex = rightIndex
        }
        ++rightIndex
      }
      if (rightIndex === tickets.length) {
        break
      }
      loopRanges.push({
        left: leftIndex,
        right: rightIndex,
      })
      leftIndex = rightIndex + 1
    }
    if (loopRanges.length === 0) {
      otherRanges = [
        {
          left: 0,
          right: tickets.length - 1,
        },
      ]
    } else {
      const tmpRanges: { left: number; right: number }[] = []
      tmpRanges.push({
        left: 0,
        right: loopRanges[0].left - 1,
      })
      for (let i = 1; i < loopRanges.length; ++i) {
        tmpRanges.push({
          left: loopRanges[i - 1].right + 1,
          right: loopRanges[i].left - 1,
        })
      }
      tmpRanges.push({
        left: loopRanges[loopRanges.length - 1].right + 1,
        right: tickets.length - 1,
      })
      otherRanges = tmpRanges.filter((range) => range.left <= range.right)
    }

    // console.info(`loopRanges: `, loopRanges)
    // console.info(`otherRanges: `, otherRanges)

    return {
      loopTicketGroups: loopRanges.map(({ left, right }) => tickets.slice(left, right + 1)),
      otherTicketGroups: otherRanges.map(({ left, right }) => tickets.slice(left, right + 1)),
    }
  }

  public static makeClosedLoopsV2(tickets: App_TrafficTicket[]) {
    const { loopTicketGroups, otherTicketGroups } = this.splitTickets(tickets)
    const closedLoops: App_TicketsFragment[] = []
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

    tickets.forEach((ticket) => {
      ticket.useForAllowance = 0
      ticket.inClosedLoop = 0
    })
    for (const tickets of loopTicketGroups) {
      const [firstTicket, ...remainTickets] = tickets
      const loopTickets = calcLoopTickets([firstTicket], remainTickets)
      if (loopTickets) {
        loopTickets.forEach((ticket) => {
          ticket.useForAllowance = 1
          ticket.inClosedLoop = 1
        })
        closedLoops.push({
          isPretty: true,
          tickets: loopTickets,
        })
      }
    }
    const singleLinks: App_TicketsFragment[] = []
    for (const tickets of otherTicketGroups) {
      let i = 0
      while (i < tickets.length) {
        const link: App_TicketsFragment = {
          isPretty: true,
          tickets: [tickets[i]],
        }
        ++i
        while (i < tickets.length && tickets[i - 1].toCity === tickets[i].fromCity) {
          link.tickets.push(tickets[i])
          ++i
        }
        link.tickets.forEach((ticket) => {
          ticket.useForAllowance = 1
        })
        singleLinks.push(link)
      }
    }
    return {
      closedLoops: closedLoops,
      singleLinks: singleLinks.filter((item) => item.tickets.length > 1),
    }
  }

  /**
   * @deprecated
   */
  public static makeClosedLoops(tickets: App_TrafficTicket[]): App_TicketsFragment[] | null {
    tickets = [...tickets]
    tickets.sort((a, b) => moment(a.fromTime).valueOf() - moment(b.toTime).valueOf())

    const closedLoops: App_TicketsFragment[] = [
      {
        isPretty: true,
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
          isPretty: true,
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

  public static makeAllowanceCoreData(detailItems: AllowanceDayItem[]): App_AllowanceCoreData {
    return {
      daysCount: detailItems.reduce((result, cur) => result + (cur.halfDay ? 0.5 : 1), 0),
      amount: detailItems.reduce((result, cur) => result + cur.amount, 0),
      detailItems: detailItems,
    }
  }
}
