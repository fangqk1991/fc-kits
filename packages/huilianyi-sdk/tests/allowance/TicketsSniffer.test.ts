import { HuilianyiServiceDev } from '../services/HuilianyiServiceDev'
import { App_TrafficTicket, TravelTools } from '../../src'
import * as assert from 'assert'

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
      const { closedLoops } = TravelTools.makeClosedLoopsV2(tickets)
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
        fromTime: '2000-01-01 01:00:00',
        toTime: '2000-01-01 01:00:00',
        fromCity: 'A',
        toCity: 'B',
      },
      {
        fromTime: '2000-01-02 01:00:00',
        toTime: '2000-01-02 01:00:00',
        fromCity: 'B',
        toCity: 'C',
      },
      {
        fromTime: '2000-01-02 02:00:00',
        toTime: '2000-01-02 02:00:00',
        fromCity: 'C',
        toCity: 'D',
      },
      {
        fromTime: '2000-01-03 01:00:00',
        toTime: '2000-01-03 01:00:00',
        fromCity: 'B',
        toCity: 'A',
      },
      {
        fromTime: '2000-01-04 01:00:00',
        toTime: '2000-01-04 01:00:00',
        fromCity: 'A',
        toCity: 'C',
      },
      {
        fromTime: '2000-01-05 01:00:00',
        toTime: '2000-01-05 01:00:00',
        fromCity: 'C',
        toCity: 'A',
      },
      {
        fromTime: '2000-01-06 02:00:00',
        toTime: '2000-01-06 02:00:00',
        fromCity: 'B',
        toCity: 'D',
      },
    ] as App_TrafficTicket[]
    const { closedLoops, singleLinks } = TravelTools.makeClosedLoopsV2(tickets)
    assert.ok(closedLoops.length > 0)
    console.info(
      'closedLoops',
      closedLoops.map((item) => item.tickets.map((ticket) => `${ticket.fromCity} - ${ticket.toCity}`))
    )
    console.info(
      'singleLinks',
      singleLinks.map((item) => item.tickets.map((ticket) => `${ticket.fromCity} - ${ticket.toCity}`))
    )
    console.info(
      'tickets',
      tickets.map((ticket) => `${ticket.fromCity} - ${ticket.toCity}`)
    )
  })
})

// Flight: 5 / 14
