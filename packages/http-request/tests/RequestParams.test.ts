import { axiosGET, RequestParams } from '../src'
import * as assert from 'assert'

describe('Test RequestParams', () => {
  it(`Test buildQuery`, async () => {
    const queryParams = {
      a: 1,
      b: 'bbb',
      c: [1, 2, 3, 4],
      d: {
        e: 1,
        f: {
          g: 1,
          h: [1, 2, 3],
          // 数组嵌套对象不合预期
          // i: [{ i1: 1 }, { i2: 1 }],
        },
      },
      // 空数组会被忽略
      j: [],
      'xxxx[': 233,
    }
    const result = RequestParams.buildQuery(queryParams)
    const expectResult =
      'a=1&b=bbb&c=1&c=2&c=3&c=4&d%5Be%5D=1&d%5Bf%5D%5Bg%5D=1&d%5Bf%5D%5Bh%5D=1&d%5Bf%5D%5Bh%5D=2&d%5Bf%5D%5Bh%5D=3&xxxx%5B=233'
    assert.ok(result === expectResult)
    await axiosGET('https://httpbin.org/get')
      .setQueryParams(queryParams)
      .setObserver({
        onRequestStart: (client) => {
          console.info(`onRequestStart`, client.getRequestUrl())
        },
        onRequestSuccess: async (client, responseData) => {
          console.info(`onRequestSuccess [${client.getDuration()}ms]`, client.getRequestUrl(), responseData)
        },
        onRequestFailure: async (client, error, responseData) => {
          console.info(
            `onRequestFailure [${client.getDuration()}ms]`,
            client.getRequestUrl(),
            error.message,
            responseData
          )
        },
      })
      .quickSend()
  })
})
