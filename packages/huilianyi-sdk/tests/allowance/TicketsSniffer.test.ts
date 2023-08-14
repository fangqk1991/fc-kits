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
      // console.info(`${userOid} ${tickets.length} tickets.`)
      const closedLoops = TravelTools.makeClosedLoops(tickets)
      if (closedLoops) {
        console.info(`${userOid} ${tickets.length} tickets.`)
        console.info(JSON.stringify(closedLoops, null, 2))
      }
    }
  })
})

// Flight: 5 / 14
