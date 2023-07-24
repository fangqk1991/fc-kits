import { loggerForDev } from '@fangcha/logger/lib'
import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'
import { AllowanceCalculator } from '../../src'

describe('Test AllowanceCalculator.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`AllowanceCalculator`, async () => {
    const rules = await huilianyiService.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    loggerForDev.info(calculator.calculateRules('01', '北京'))
    loggerForDev.info(calculator.calculateRules('NULL', '北京'))
  })

  it(`calculateRules`, async () => {
    const searcher = await new huilianyiService.modelsCore.HLY_TravelAllowance().fc_searcher()
    const feeds = await searcher.queryAllFeeds()
    console.info(
      JSON.stringify(
        feeds.map((item) => item.extrasData().closedLoops),
        null,
        2
      )
    )
  })
})
