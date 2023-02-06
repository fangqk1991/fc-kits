import { AppRequest } from '../src/deprecated'
import fs = require('fs')
import assert = require('assert')

describe('Test AppRequest', () => {
  it(`Test normal post`, async () => {
    const request = new AppRequest('POST', 'https://service.fangcha.me/api/test/http/test_post_json')
    request.setResponseJSON(true)
    request.setBody({
      key1: 'value',
    })
    const response = await request.execute()
    assert.ok(typeof request.getResponseHeaders() === 'object')
    assert.ok(typeof response === 'object')
  })

  it(`Test 302`, async () => {
    const request = new AppRequest('GET', 'https://service.fangcha.me/api/test/http/test_302')
    request.setResponseJSON(true)
    const response = await request.execute()
    console.info(response)
    assert.ok(typeof request.getResponseHeaders() === 'object')
    assert.ok(typeof response === 'object')
  })

  it(`Test forcible json response`, async () => {
    try {
      const request = new AppRequest('GET', 'https://baidu.com/')
      request.setResponseJSON(true)
      await request.execute()
      assert.fail()
    } catch (e: any) {
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test long time request`, async () => {
    const request = new AppRequest('POST', 'https://service.fangcha.me/api/test/http/test_delay')
    request.setResponseJSON(true)
    const response = await request.execute()
    // console.info(response)
    assert.ok(typeof response === 'object')
  })

  it(`Test error code`, async () => {
    try {
      const request = new AppRequest('GET', 'https://service.fangcha.me/api/test/http/test_code')
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.info(e.statusCode, e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test nonexistent api `, async () => {
    try {
      const request = new AppRequest('GET', 'https://service.fangcha.me/api/test/http/nonexistence')
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.info(e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test nonexistent server `, async () => {
    try {
      const request = new AppRequest('GET', 'http://nonexistence.server/')
      request.setTimeout(1000)
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.info(e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test post file`, async () => {
    const request = new AppRequest('POST', 'https://service.fangcha.me/api/test/http/test_post_files')
    request.setFormData({
      file1: {
        value: Buffer.from(`Hello!`),
        options: {
          filename: 'file1.txt',
        },
      },
      file2: fs.createReadStream(`${__dirname}/hello.txt`),
    })
    request.setResponseJSON(true)
    const response = await request.execute()
    assert.ok(typeof response === 'object')
  })

  it(`Test catch error `, async () => {
    const request = new AppRequest('GET', 'https://service.fangcha.me/api/test/http/nonexistence')
    request.setErrorHandler((_err) => {
      console.info('handle error')
    })
    await request.execute()
  })

  it(`Test download`, async () => {
    const request = new AppRequest('GET', 'https://image.fangqk.com/2019-02-23/performance-time-sequence.png')
    const localPath = `${__dirname}/test.jpg`
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
    fs.writeFileSync(localPath, await request.downloadBuffer())
    assert.ok(fs.existsSync(localPath))
    fs.unlinkSync(localPath)
  })

  it(`Test download fail`, async () => {
    const request = new AppRequest('GET', 'https://image.fangqk.com/nonexistence')
    try {
      const localPath = `${__dirname}/test.jpg`
      fs.writeFileSync(localPath, await request.downloadBuffer())
      assert.fail()
    } catch (e: any) {}
  })

  it(`Test download catch error`, async () => {
    const request = new AppRequest('GET', 'https://image.fangqk.com/nonexistence')
    request.setErrorHandler(() => {
      console.info('handle error')
    })
    const buffer = await request.downloadBuffer()
    assert.ok(!buffer)
  })
})
