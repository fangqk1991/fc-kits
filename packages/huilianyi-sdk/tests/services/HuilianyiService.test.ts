import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src'

describe('Test HuilianyiService.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`reloadExpenseTypeMetadata`, async () => {
    await huilianyiService.reloadExpenseTypeMetadata()
    const metadata = await huilianyiService.getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })

  it(`getExpenseTypeMetadata`, async () => {
    const metadata = await huilianyiService.getExpenseTypeMetadata()
    console.info(JSON.stringify(metadata, null, 2))
  })
})
