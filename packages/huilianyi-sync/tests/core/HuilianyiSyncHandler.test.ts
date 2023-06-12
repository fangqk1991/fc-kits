import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiSyncHandler } from '../../src/services/HuilianyiSyncHandler'
import { HuilianyiSyncCore } from '../../src/services/HuilianyiSyncCore'

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
