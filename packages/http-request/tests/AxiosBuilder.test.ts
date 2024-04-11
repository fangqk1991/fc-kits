import * as assert from 'assert'
import { axiosDownload, axiosGET, axiosPOST, RequestObserverV2 } from '../src'
import { AxiosError } from 'axios'
import * as fs from 'fs'
import AppError from '@fangcha/app-error'

const observer: RequestObserverV2 = {
  onRequestStart: (client) => {
    console.info(`onRequestStart`, client.getRequestUrl())
  },
  onRequestSuccess: async (client, responseData) => {
    console.info(`onRequestSuccess [${client.getDuration()}ms]`, client.getRequestUrl(), responseData)
  },
  onRequestFailure: async (client, error, responseData) => {
    console.info(`onRequestFailure [${client.getDuration()}ms]`, client.getRequestUrl(), error.message, responseData)
  },
}

describe('Test AxiosBuilder', () => {
  it(`Test normal post`, async () => {
    const builder = axiosPOST('https://service.fangcha.me/api/test/http/test_post_json')
    builder.setObserver(observer)
    builder.setBodyData({
      key1: 'value',
    })

    await builder.execute()
    const response = builder.axiosResponse!
    assert.ok(typeof response === 'object')
    assert.strictEqual(response.status, 200)
    assert.ok(typeof response.config === 'object')
    assert.ok(typeof response.headers === 'object')
    assert.ok(typeof response.data === 'object')
  })

  it(`Test 302`, async () => {
    try {
      const builder = axiosGET('https://service.fangcha.me/api/test/http/test_302')
      builder.setObserver(observer)
      builder.addAxiosConfig({
        maxRedirects: 0,
      })
      await builder.execute()
      assert.fail()
    } catch (e: any) {
      assert.strictEqual(e.statusCode, 302)
    }
  })

  it(`Test long time request`, async () => {
    const builder = axiosPOST('https://service.fangcha.me/api/test/http/test_delay')
    builder.setObserver(observer)
    await builder.execute()
    const response = builder.axiosResponse!
    assert.ok(typeof response === 'object')
    assert.strictEqual(response.status, 200)
  })

  it(`Test error code`, async () => {
    try {
      await axiosGET('https://service.fangcha.me/api/test/http/test_code').setObserver(observer).execute()
      assert.fail()
    } catch (e: any) {
      assert.strictEqual(e.statusCode, 400)
    }
  })

  it(`Test nonexistent api `, async () => {
    try {
      await axiosGET('https://service.fangcha.me/api/test/http/nonexistence').setObserver(observer).execute()
      assert.fail()
    } catch (e: any) {
      assert.strictEqual(e.statusCode, 404)
    }
  })

  it(`Test nonexistent server `, async () => {
    try {
      await axiosGET('http://nonexistence.server/').setObserver(observer).execute()
      assert.fail()
    } catch (e: any) {
      assert.strictEqual(e.statusCode, 503)
    }
  })

  it(`Test post file`, async () => {
    const builder = axiosPOST('https://service.fangcha.me/api/test/http/test_post_files')
    builder.setObserver(observer)
    builder.setFormData({
      file1: {
        value: Buffer.from(`Hello!`),
        options: {
          filename: 'file1.txt',
        },
      },
      file2: fs.createReadStream(`${__dirname}/hello.txt`),
    })
    builder.addFormData({
      file2: fs.createReadStream(`${__dirname}/hello.txt`),
    })
    const response = await builder.quickSend()
    assert.ok(!!response)
    assert.ok(!!response['data'])
    const data = response['data'] as any
    assert.ok(!!data.file1)
    assert.ok(!!data.file2)
  })

  it(`Test catch error `, async () => {
    const builder = axiosGET('https://service.fangcha.me/api/test/http/nonexistence')
    builder.setObserver(observer)
    builder.setErrorHandler((error) => {
      assert.strictEqual(error.statusCode, 404)
    })
    await builder.execute()
  })

  it(`Test download`, async () => {
    const data = await axiosDownload('https://image.fangqk.com/2019-02-23/performance-time-sequence.png')
      .setObserver(observer)
      .quickSend()
    const localPath = `${__dirname}/test.jpg`
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
    fs.writeFileSync(localPath, data)
    assert.ok(fs.existsSync(localPath))
    fs.unlinkSync(localPath)
  })

  it(`Test properties`, async () => {
    const builder = axiosGET('https://httpbin.org/get')
      .setObserver(observer)
      .setQueryParams({ a: [1, 2] })
    await builder.quickSend()
    assert.strictEqual(builder.getRequestMethod(), 'GET')
    assert.strictEqual(builder.getRequestUrl(), 'https://httpbin.org/get?a=1&a=2')
    assert.strictEqual(builder.getHomeName(), 'httpbin.org')
    assert.strictEqual(builder.getProtocol(), 'https')
  })

  it(`Test httpbin status`, async () => {
    const statusList = [400, 401, 402, 403, 404, 500, 501, 502, 503, 504]
    for (const statusCode of statusList) {
      await axiosGET(`https://httpbin.org/status/${statusCode}`)
        .setObserver(observer)
        .setErrorHandler((err) => {
          assert.strictEqual(statusCode, err.statusCode)
        })
        .quickSend()
    }
  })

  it(`Test setResponse200Checker`, async () => {
    const theError = new AppError('response format invalid', 400)
    await axiosGET('https://httpbin.org/get')
      .setObserver(observer)
      .setResponse200Checker(() => {
        throw theError
      })
      .setErrorHandler((err) => {
        assert.strictEqual(theError, err)
      })
      .quickSend()
  })
})
