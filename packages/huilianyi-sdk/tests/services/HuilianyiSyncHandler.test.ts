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

  it(`dumpInvoiceRecords`, async () => {
    await huilianyiService.syncHandler().dumpInvoiceRecords(true)
  })

  it(`dumpOrderFlightRecords`, async () => {
    await huilianyiService.syncHandler().dumpOrderFlightRecords(true)
  })

  it(`dumpOrderTrainRecords`, async () => {
    await huilianyiService.syncHandler().dumpOrderTrainRecords(true)
  })

  it(`dumpOrderHotelRecords`, async () => {
    await huilianyiService.syncHandler().dumpOrderHotelRecords(true)
  })
})
