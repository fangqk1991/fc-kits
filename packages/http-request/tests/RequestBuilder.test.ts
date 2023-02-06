import { RequestBuilder } from '../src/deprecated'
import fs = require('fs')
import assert = require('assert')
import { CommonAPI } from '../src'

const fangchaBuilder = new RequestBuilder('https://service.fangcha.me')
const APIData = {
  NormalPOST: {
    method: 'POST',
    route: '/api/test/http/test_post_json',
  },
  TestDelay: {
    method: 'POST',
    route: '/api/test/http/test_delay',
  },
  TestCode: {
    method: 'POST',
    route: '/api/test/http/test_code',
  },
  Nonexistence: {
    method: 'POST',
    route: '/api/test/http/nonexistence',
  },
}

describe('Test RequestBuilder', () => {
  it(`Test normal post`, async () => {
    const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.NormalPOST))
    request.setResponseJSON(true)
    request.setBody({ key1: 'value' })
    const response = await request.execute()
    assert.ok(typeof request.getResponseHeaders() === 'object')
    assert.ok(typeof response === 'object')
  })

  it(`Test forcible json response`, async () => {
    try {
      const request = RequestBuilder.buildRequestForGET('https://baidu.com/', {
        key1: 'value1',
        nonKey: null,
      })
      assert.ok(request.uri === 'https://baidu.com/?key1=value1')
      request.setResponseJSON(true)
      await request.execute()
      assert.fail()
    } catch (e: any) {
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test long time request`, async () => {
    const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.TestDelay))
    request.setResponseJSON(true)
    const response = await request.execute()
    // console.log(response)
    assert.ok(typeof response === 'object')
  })

  it(`Test error code`, async () => {
    try {
      const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.TestCode))
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.log(e.statusCode, e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test nonexistent api`, async () => {
    try {
      const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.Nonexistence))
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.log(e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test nonexistent server`, async () => {
    try {
      const request = RequestBuilder.buildRequestForGET('http://nonexistence.server/')
      request.setTimeout(1000)
      await request.execute()
      assert.fail()
    } catch (e: any) {
      // console.log(e.message)
      assert.ok(typeof e.statusCode === 'number')
      assert.ok(typeof e.message === 'string')
    }
  })

  it(`Test post file`, async () => {
    const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.NormalPOST))
    request.setResponseJSON(true)
    request.setFormData({
      file2: fs.createReadStream(`${__dirname}/hello.txt`),
    })
    const response = await request.execute()
    assert.ok(typeof response === 'object')
  })

  it(`Test catch error `, async () => {
    const request = fangchaBuilder.buildRequest(CommonAPI.create(APIData.Nonexistence))
    request.setErrorHandler(() => {
      // console.log('catch error: ', err)
    })
    await request.execute()
  })

  it(`Test download`, async () => {
    const request = RequestBuilder.buildRequestForGET(
      'https://image.fangqk.com/2019-02-23/performance-time-sequence.png'
    )
    const localPath = `${__dirname}/test.jpg`
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath)
    }
    fs.writeFileSync(localPath, await request.downloadBuffer())
    assert.ok(fs.existsSync(localPath))
    fs.unlinkSync(localPath)
  })

  // it(`Test download catch error`, async () => {
  //   const request = RequestBuilder.buildRequestForGET('https://image.fangqk.com/nonexistence')
  //   request.setErrorHandler(() => {
  //     console.log('handle error')
  //   })
  //   const localPath = `${__dirname}/test.jpg`
  //   fs.writeFileSync(localPath, await request.downloadBuffer())
  // })
})
