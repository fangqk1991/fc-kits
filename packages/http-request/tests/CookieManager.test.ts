import { CookieManager } from '../src'
import assert = require('assert')

describe('Test CookieManager', () => {
  it(`Test normal`, () => {
    const cookieStr = '_ga=GA1.2.1751175547.1555315055; _gat=1'
    const manager = new CookieManager(cookieStr)
    assert.ok(manager.get('_ga') === 'GA1.2.1751175547.1555315055')
    assert.ok(manager.get('_gat') === '1')
    assert.ok(manager.get('nonexistence', 888) === 888)
  })
})
