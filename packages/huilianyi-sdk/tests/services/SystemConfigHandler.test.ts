import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test SystemConfigHandler.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`getManagerMetadata`, async () => {
    const data = await huilianyiService.configHandler().getManagerMetadata()
    console.info(data)
  })

  it(`getExpenseTypeMetadata`, async () => {
    const data = await huilianyiService.configHandler().getExpenseTypeMetadata()
    console.info(data)
  })
})
