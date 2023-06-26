import { CustomRequestFollower } from '@fangcha/backend-kit'
import { CTripConfigTest } from '../CTripConfigTest'
import { CTripProxy } from '../../src'

describe('Test CTripProxy.test.ts', () => {
  const cTripProxy = new CTripProxy(CTripConfigTest, CustomRequestFollower)

  it(`searchOrder`, async () => {
    const items = await cTripProxy.searchOrder()
    console.info(JSON.stringify(items, null, 2))
  })
})
