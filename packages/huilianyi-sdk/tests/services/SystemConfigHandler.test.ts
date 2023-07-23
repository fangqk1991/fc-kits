import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test SystemConfigHandler.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`getManagerMetadata`, async () => {
    await huilianyiService.configHandler().reloadManagerMetadata()
    const data = await huilianyiService.configHandler().getManagerMetadata()
    console.info(data)
  })

  it(`getExpenseTypeMetadata`, async () => {
    const data = await huilianyiService.configHandler().getExpenseTypeMetadata()
    console.info(data)
  })

  it(`getWholeConfigs`, async () => {
    const data = await huilianyiService.configHandler().getWholeConfigs()
    console.info(data)
  })

  it(`getCostCenterMetadata`, async () => {
    const data = await huilianyiService.configHandler().getCostCenterMetadata()
    console.info(data)
  })
})
