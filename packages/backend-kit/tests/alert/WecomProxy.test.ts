import * as moment from 'moment'
import { WecomProxy } from '../../src/alert'

describe('Test WecomProxy.test.ts', () => {
  const wecomProxy = new WecomProxy({})

  it(`Test sendMessage`, async () => {
    await wecomProxy.sendMessage(
      '44c6a32d-9505-4e53-bab1-949442e0e28b',
      `WecomProxy.sendMessage: ${Math.random()} at ${moment().format()}`,
      ['@all']
    )
  })

  it(`Test sendMarkdown`, async () => {
    await wecomProxy.sendMarkdown(
      '44c6a32d-9505-4e53-bab1-949442e0e28b',
      `WecomProxy.sendMessage: ${Math.random()} at ${moment().format()}\nWecomProxy.sendMessage: ${Math.random()} at ${moment().format()}\n123\n456`
    )
  })

  it(`Test notifyApiError`, async () => {
    wecomProxy.setRetainedBotKey('44c6a32d-9505-4e53-bab1-949442e0e28b')
    await wecomProxy.notifyApiError({
      referer: '',
      api: '/test/api/path',
      method: 'GET',
      user: 'test.user',
      statusCode: 500,
      errorMsg: 'Test Error Message',
      ipAddress: '127.0.0.1',
      reqid: 'xxx-xxx',
      duration: 0,
    })
  })
})
