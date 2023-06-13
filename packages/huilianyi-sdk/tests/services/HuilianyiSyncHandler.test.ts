import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiSyncCore, HuilianyiSyncHandler } from '../../src'

describe('Test HuilianyiSyncHandler.test.ts', () => {
  const syncCore = new HuilianyiSyncCore({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  const syncHandler = new HuilianyiSyncHandler(syncCore)

  it(`dumpExpenseRecords`, async () => {
    await syncHandler.dumpExpenseRecords()
  })
})
