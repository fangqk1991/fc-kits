import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test HuilianyiSyncHandler.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`dumpDepartmentRecords`, async () => {
    await huilianyiService.syncHandler().dumpDepartmentRecords()
  })

  it(`dumpStaffRecords`, async () => {
    await huilianyiService.syncHandler().dumpStaffRecords()
  })

  it(`dumpExpenseRecords`, async () => {
    await huilianyiService.syncHandler().dumpExpenseRecords(true)
  })

  it(`dumpPublicPaymentRecords`, async () => {
    await huilianyiService.syncHandler().dumpPublicPaymentRecords(true)
  })

  it(`dumpTravelRecords`, async () => {
    await huilianyiService.syncHandler().dumpTravelRecords(true)
  })

  it(`dumpInvoiceRecords`, async () => {
    await huilianyiService.syncHandler().dumpInvoiceRecords(true)
  })

  it(`getFlightChangeInfoMapper`, async () => {
    const mapper = await huilianyiService.syncHandler().getFlightChangeInfoMapper()
    console.info(JSON.stringify(mapper, null, 2))
  })

  it(`dumpExpenseApplicationRecords`, async () => {
    await huilianyiService.syncHandler().dumpExpenseApplicationRecords(true)
  })
})
