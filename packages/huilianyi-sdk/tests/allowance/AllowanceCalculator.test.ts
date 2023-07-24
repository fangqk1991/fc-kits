import { loggerForDev } from '@fangcha/logger/lib'
import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'
import { AllowanceCalculator } from '../../src'
import * as moment from 'moment'

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

  it(`calculateAllowanceDayItems`, async () => {
    const searcher = await new huilianyiService.modelsCore.HLY_TravelAllowance().fc_searcher()
    searcher.processor().addConditionKV('is_pretty', 1)
    const feeds = await searcher.queryAllFeeds()

    const rules = await huilianyiService.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    for (const feed of feeds) {
      const dayItems = calculator.calculateAllowanceDayItems('', feed.extrasData().closedLoops)
      // console.info(JSON.stringify(dayItems, null, 2))
    }
  })

  it(`moments`, async () => {
    console.info(moment().utcOffset('+01:00').format())
    console.info(moment().utcOffset('+01:00', true).format())
  })
})
