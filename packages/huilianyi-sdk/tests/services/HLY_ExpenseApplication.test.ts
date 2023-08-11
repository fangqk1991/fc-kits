import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HLY_ExpenseApplication.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`HLY_ExpenseApplication.getMonthReports`, async () => {
    const monthReports = await huilianyiService.modelsCore.HLY_ExpenseApplication.getMonthReports()
    console.info(monthReports)
  })
})
