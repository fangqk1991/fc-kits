import { loggerForDev } from '@fangcha/logger'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiTokenKeeper } from '../../src/HuilianyiTokenKeeper'
import { HuilianyiConfig } from './HuilianyiConfig'

describe('Test HuilianyiTokenKeeper.test.ts', () => {
  const keeper = new HuilianyiTokenKeeper(HuilianyiConfig, CustomRequestFollower)

  it(`requireTenantAccessToken`, async () => {
    const accessToken = await keeper.requireTenantAccessToken()
    loggerForDev.info(accessToken)
  })

  it(`Concurrency requireTenantAccessToken`, async () => {
    const resultList = await Promise.all(
      new Array(100).fill(1).map(() => {
        return keeper.requireTenantAccessToken()
      })
    )
    loggerForDev.info(resultList)
  })
})
