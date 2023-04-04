import * as moment from 'moment'
import { FeishuBot } from '../../src'

describe('Test FeishuBot.test.ts', () => {
  const feishuBot = new FeishuBot({})

  it(`Test sendMessage`, async () => {
    await feishuBot.sendMessage(
      'c31ef9ec-1364-4e35-b506-0400ac26d444',
      `FeishuBot.sendMessage: ${Math.random()} at ${moment().format()}`,
      ['@all']
    )
  })
  //
  // it(`Test sendMarkdown`, async () => {
  //   await FeishuBot.sendMarkdown(
  //     '44c6a32d-9505-4e53-bab1-949442e0e28b',
  //     `FeishuBot.sendMessage: ${Math.random()} at ${moment().format()}\nFeishuBot.sendMessage: ${Math.random()} at ${moment().format()}\n123\n456`
  //   )
  // })

  it(`Test notifyApiError`, async () => {
    feishuBot.setRetainedBotKey('c31ef9ec-1364-4e35-b506-0400ac26d444')
    await feishuBot.notifyApiError({
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
