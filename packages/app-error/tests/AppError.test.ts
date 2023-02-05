import * as assert from 'assert'
import AppError from '../src'

describe('Test AppError class', (): void => {
  const message = 'Some error message.'
  const statusCode = 404
  const extras = { k1: 1, k2: 2 }

  it(`Only message.`, (): void => {
    try {
      throw new AppError(message)
    } catch (err: any) {
      assert.ok(err.message === message)
      assert.ok(err.statusCode === 500)
      assert.ok(err.name === 'AppError')
    }
  })

  it(`Full parameters.`, (): void => {
    try {
      throw new AppError(message, statusCode, extras)
    } catch (err: any) {
      assert.ok(err.message === message)
      assert.ok(err.statusCode === statusCode)
      assert.ok(err.extras === extras)
      assert.ok(err.name === 'AppError')
    }
  })
})
