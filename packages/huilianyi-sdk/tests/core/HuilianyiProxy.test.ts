import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiProxy } from '../../src/HuilianyiProxy'

describe('Test HuilianyiProxy.test.ts', () => {
  const feishuClient = new HuilianyiProxy(GlobalAppConfig.HuilianyiSDK, CustomRequestFollower)

  it(`getCompanyList`, async () => {
    const items = await feishuClient.getCompanyList()
    console.info(items)
  })
})
