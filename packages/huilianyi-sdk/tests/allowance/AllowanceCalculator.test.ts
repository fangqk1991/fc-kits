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
    loggerForDev.info(calculator.calculateResult('01', '北京'))
    loggerForDev.info(calculator.calculateResult('NULL', '北京'))
  })
})
