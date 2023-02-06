import * as log4js from 'log4js'
import * as _ from 'lodash'
import { Configuration } from 'log4js'
export { Logger } from 'log4js'

const _defaultOptions: Configuration = {
  pm2: true,
  appenders: {
    out: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '[%x{reqid}] [%d{ISO8601_WITH_TZ_OFFSET}] [%x{executor}] [%x{ip}] [%p] [%x{user}] %m',
        tokens: {
          reqid(logEvent) {
            return logEvent.context.reqid || '-'
          },
          user(logEvent) {
            return logEvent.context.user || '-'
          },
          ip(logEvent) {
            return logEvent.context.ip || '-'
          },
          executor(logEvent) {
            return logEvent.context.executor || '-'
          },
        },
      },
    },
    pureInfo: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: [
          '########################################################',
          '############### %d ################',
          '%m',
          '########################################################',
        ].join('\n'),
      },
    },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info',
    },
    forDev: {
      appenders: ['pureInfo'],
      // 仅在本地开发环境日志级别为 ALL
      level: process.env.ENV_FOR_DEVELOPMENT ? 'ALL' : 'info',
    },
  },
}

log4js.configure(_defaultOptions)

export const logger = log4js.getLogger()
export const loggerForDev = log4js.getLogger('forDev')

export default log4js

export const initLoggerForApp = (appName: string) => {
  const extras: Partial<Configuration> = {
    appenders: {
      out: {
        type: 'console',
        layout: {
          tokens: {
            executor(logEvent) {
              return logEvent.context.executor || appName || '-'
            },
          },
        },
      },
    },
  }
  log4js.configure(_.defaultsDeep(extras, _defaultOptions))
  logger.addContext('executor', appName)
}
