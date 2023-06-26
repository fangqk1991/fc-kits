import { loggerForDev } from '@fangcha/logger'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { CTripTokenKeeper } from '../../src'
import { CTripConfigTest } from '../CTripConfigTest'

describe('Test CTripTokenKeeper.test.ts', () => {
  const keeper = new CTripTokenKeeper(CTripConfigTest, CustomRequestFollower)

  it(`requireTicket`, async () => {
    const accessToken = await keeper.requireTicket()
    loggerForDev.info(accessToken)
  })

  it(`Concurrency requireTicket`, async () => {
    const resultList = await Promise.all(
      new Array(100).fill(1).map(() => {
        return keeper.requireTicket()
      })
    )
    loggerForDev.info(resultList)
  })
})
