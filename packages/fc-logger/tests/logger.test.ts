import { initLoggerForApp, logger } from '../src'
import * as log4js from 'log4js'

describe('Test logger.test.ts', () => {
  it(`Test logger`, async () => {
    logger.info('123')
    logger.addContext('executor', 'test-app')
    logger.info('456')
    log4js.getLogger().info('abc')
  })

  it(`Test instance`, async () => {
    const logger = log4js.getLogger()
    logger.info('abc')
  })

  it(`Test initLoggerForApp`, async () => {
    log4js.getLogger().info('log4js.getLogger() before')
    logger.info('log4js.getLogger() before')
    initLoggerForApp('fc')
    log4js.getLogger().info('log4js.getLogger() after')
    logger.info('log4js.getLogger() after')
  })
})
