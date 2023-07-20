import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HLY_ExpenseApplication.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_ExpenseApplication.getMonthReports`, async () => {
    const monthReports = await huilianyiService.modelsCore.HLY_ExpenseApplication.getMonthReports()
    console.info(monthReports)
  })
})
