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
      const fragments = TravelTools.splitTickets(tickets)
      for (const tickets of fragments) {
        // console.info(`${userOid} ${tickets.length} tickets.`)
        const closedLoops = TravelTools.makeClosedLoops(tickets)
        if (closedLoops) {
          if (tickets[0].userOid) {
            await huilianyiService.travelService().makeDummyTravel(tickets.map((item) => item.ticketId))
          }
          console.info(`${userOid} ${tickets.length} tickets.`)
          // console.info(JSON.stringify(closedLoops, null, 2))
        }
      }
    }
  })
})

// Flight: 5 / 14
