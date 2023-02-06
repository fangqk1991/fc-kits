import * as assert from 'assert'
const axios = require('axios')

describe('Test axios.test.ts', () => {
  it(`Test axios`, async () => {
    const response = await axios.get('https://httpbin.org/get')
    console.info(response.data)
    assert.ok(!!response)
  })
})
