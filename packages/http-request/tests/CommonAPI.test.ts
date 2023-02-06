import { CommonAPI } from '../src'
import assert = require('assert')

describe('Test CommonAPI', () => {
  it(`Test CommonAPI`, () => {
    const route = '/user/:userId/project/:projectId'
    const commonAPI = new CommonAPI(
      {
        route: route,
        method: 'GET',
        description: 'Test API',
      },
      '123',
      '456'
    )
    assert.ok(commonAPI.toString() === 'GET /user/123/project/456 (Test API)')
    assert.ok(commonAPI.api === '/user/123/project/456')
    assert.ok(commonAPI.route === route)
  })

  it(`Test URL`, () => {
    const route = 'http://localhost:3000/user/:userId/project/:projectId'
    const commonAPI = new CommonAPI(
      {
        route: route,
        method: 'GET',
        description: 'Test API',
      },
      '123',
      '456'
    )
    assert.ok(commonAPI.toString() === 'GET http://localhost:3000/user/123/project/456 (Test API)')
    assert.ok(commonAPI.api === 'http://localhost:3000/user/123/project/456')
    assert.ok(commonAPI.route === route)
  })
})
