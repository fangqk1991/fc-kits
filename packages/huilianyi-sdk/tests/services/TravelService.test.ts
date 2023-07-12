import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })
  const travelService = huilianyiService.travelService()
  const HLY_OrderTrain = huilianyiService.modelsCore.HLY_OrderTrain
  const HLY_OrderFlight = huilianyiService.modelsCore.HLY_OrderFlight

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
})
