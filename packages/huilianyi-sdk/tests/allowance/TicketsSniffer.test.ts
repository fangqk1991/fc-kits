import { HuilianyiServiceDev } from '../services/HuilianyiServiceDev'
import { App_TrafficTicket, TravelTools } from '../../src'

describe('Test TicketsSniffer.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`make closed loops`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher.processor().addConditionKV('is_valid', 1)
    searcher.processor().addSpecialCondition('business_code = ?', '')
    searcher.processor().addOrderRule('from_time', 'ASC')
    const items = await searcher.queryJsonFeeds<App_TrafficTicket>()
    const ticketMapper: { [p: string]: App_TrafficTicket[] } = {}
    for (const item of items) {
      if (!ticketMapper[item.userOid || item.userName]) {
        ticketMapper[item.userOid || item.userName] = []
      }
      ticketMapper[item.userOid || item.userName].push(item)
    }

    const userIdList = Object.keys(ticketMapper)
    for (const userOid of userIdList) {
      const tickets = ticketMapper[userOid]
      if (!tickets[0].userOid) {
        continue
      }
      // console.info(
      //   tickets[0].userName,
      //   tickets.map((item) => {
      //     const fromTime = TimeUtils.momentUTC8(item.fromTime).format('MM-DD HH:mm')
      //     const toTime = TimeUtils.momentUTC8(item.toTime).format('MM-DD HH:mm')
      //     return `${fromTime} ~ ${toTime} ${item.trafficCode} ${item.fromCity} - ${item.toCity}`
      //   })
      // )
      // console.info(
      //   tickets[0].userName,
      //   TravelTools.splitTickets(tickets).map((fragment) => {
      //     return fragment.map((item) => {
      //       const fromTime = TimeUtils.momentUTC8(item.fromTime).format('MM-DD HH:mm')
      //       const toTime = TimeUtils.momentUTC8(item.toTime).format('MM-DD HH:mm')
      //       return `${fromTime} ~ ${toTime} ${item.trafficCode} ${item.fromCity} - ${item.toCity}`
      //     })
      //   })
      // )
      const closedLoops = TravelTools.makeClosedLoopsV2(tickets)
      for (const loopItem of closedLoops) {
        if (loopItem.tickets[0].userOid) {
          await huilianyiService.travelService().makeDummyTravel(loopItem.tickets.map((item) => item.ticketId))
        }
        console.info(`${userOid} ${loopItem.tickets.length} tickets.`, loopItem.tickets)
        // console.info(JSON.stringify(closedLoops, null, 2))
      }
    }
  })

  it(`makeClosedLoopsV2`, async () => {
    const tickets = [
      {
        fromCity: 'A',
        toCity: 'B',
      },
      {
        fromCity: 'B',
        toCity: 'C',
      },
      {
        fromCity: 'B',
        toCity: 'A',
      },
      {
        fromCity: 'A',
        toCity: 'C',
      },
      {
        fromCity: 'C',
        toCity: 'A',
      },
    ] as App_TrafficTicket[]
    const closedLoops = TravelTools.makeClosedLoopsV2(tickets)
    console.info(
      closedLoops.map((item) => item.tickets.map((ticket) => `${ticket.fromCity} - ${ticket.toCity}`)),
      tickets.map((ticket) => `${ticket.fromCity} - ${ticket.toCity}`)
    )
  })
})

// Flight: 5 / 14
