import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const travelService = huilianyiService.travelService()
  const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain
  const HLY_OrderFlight = huilianyiService.modelsCore.HLY_OrderFlight
  const HLY_Travel = huilianyiService.modelsCore.HLY_Travel

  it(`getTravelTicketsData - Train`, async () => {
    const searcher0 = new HLY_OrderTrain().fc_searcher()
    searcher0.processor().addSpecialCondition('LENGTH(business_code) = 10')
    const travelItem = (await searcher0.queryOne())!

    const ticketsData = await travelService.getTravelTicketsData(travelItem.businessCode)
    console.info(ticketsData)
  })

  it(`getTravelTicketsData - Flight`, async () => {
    const searcher0 = new HLY_OrderFlight().fc_searcher()
    searcher0.processor().addSpecialCondition('LENGTH(business_code) = 10')
    const travelItem = (await searcher0.queryOne())!

    const ticketsData = await travelService.getTravelTicketsData(travelItem.businessCode)
    console.info(ticketsData)
  })

  it(`getFullTravelInfos`, async () => {
    const items = await new HLY_Travel().fc_searcher().queryFeeds()
    const fullInfos = await travelService.getFullTravelInfos(items.map((item) => item.modelForClient()))
    console.info(
      JSON.stringify(
        fullInfos.map((item) => item.ticketsData.trafficTickets).filter((tickets) => tickets.length > 0),
        null,
        2
      )
    )
  })

  it(`refreshTravelTicketItemsData`, async () => {
    // await huilianyiService.syncHandler().dumpTravelRecords(true)
    // await huilianyiService.syncHandler().dumpOrderFlightRecords(true)
    // await huilianyiService.syncHandler().dumpOrderTrainRecords(true)
    await travelService.refreshTravelTicketItemsData()

    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addSpecialCondition('employee_traffic_items_str IS NOT NULL')
    const items = await searcher.queryAllFeeds()
    for (const travelItem of items) {
      const trafficItems = travelItem.employeeTrafficItems()
      if (trafficItems.filter((item) => item.isClosedLoop).length > 0) {
        console.info(travelItem.businessCode, travelItem.matchClosedLoop, travelItem.isPretty)
        // console.info(travelItem.businessCode, JSON.stringify(trafficItems, null, 2))
      }
    }
  })
})
