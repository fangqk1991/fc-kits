import { GlobalAppConfig } from 'fc-config'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HuilianyiProxy } from '../../src/HuilianyiProxy'

describe('Test HuilianyiProxy.test.ts', () => {
  const feishuClient = new HuilianyiProxy(GlobalAppConfig.HuilianyiSDK, CustomRequestFollower)

  it(`getCompanyList`, async () => {
    const response = await feishuClient.getCompanyList()
    console.info(response)
  })
})
