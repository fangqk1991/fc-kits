import { HuilianyiServiceDev } from './HuilianyiServiceDev'

describe('Test SystemConfigHandler.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

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
