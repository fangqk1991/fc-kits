import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiSyncHandler.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`dumpDepartmentRecords`, async () => {
    await huilianyiService.syncHandler().dumpDepartmentRecords()
  })

  it(`dumpStaffRecords`, async () => {
    await huilianyiService.syncHandler().dumpStaffRecords()
  })

  it(`dumpExpenseRecords`, async () => {
    await huilianyiService.syncHandler().dumpExpenseRecords(true)
  })

  it(`dumpTravelRecords`, async () => {
    await huilianyiService.syncHandler().dumpTravelRecords(true)
  })
})
