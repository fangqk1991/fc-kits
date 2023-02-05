import assert from '../src'
import * as systemAssert from 'assert'

describe('Test AppError class', function () {
  it(`Test True.`, () => {
    assert.ok(true, 'Something wrong')
  })
  it(`Test False.`, () => {
    try {
      // @ts-ignore
      assert.ok(1 === 2, 'Not equal', 444)
    } catch (e: any) {
      systemAssert.ok(e.statusCode === 444)
      systemAssert.ok(e.message === 'Not equal')
    }
  })
})
