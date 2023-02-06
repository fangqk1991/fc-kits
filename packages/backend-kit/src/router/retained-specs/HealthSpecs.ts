import { SpecFactory } from '@fangcha/router'
import { _FangchaState } from '../../main'
import { RetainedHealthApis } from '../../common/apis'

const factory = new SpecFactory('Health Apis')

factory.prepare(RetainedHealthApis.Ping, async (ctx) => {
  ctx.body = 'PONG'
})

factory.prepare(RetainedHealthApis.PingHealth, async (ctx) => {
  await _FangchaState.checkHealth()
  ctx.body = _FangchaState.retainHealthWord || 'PONG'
})

factory.prepare(RetainedHealthApis.PingAuth, async (ctx) => {
  ctx.body = 'PONG'
})

factory.prepare(RetainedHealthApis.PingPrint, async (ctx) => {
  console.info('query: ', JSON.stringify(ctx.request.query, null, 2))
  ctx.body = 'PONG'
})

factory.prepare(RetainedHealthApis.PingQuery, async (ctx) => {
  ctx.body = ctx.request.query
})

factory.prepare(RetainedHealthApis.PingFullData, async (ctx) => {
  ctx.body = {
    headers: ctx.request.headers,
    query: ctx.request.query,
    bodyData: ctx.request.body,
  }
})

factory.prepare(RetainedHealthApis.PingError, async (_ctx) => {
  throw new Error('Ping Error Test')
})

factory.prepare(RetainedHealthApis.SystemInfoGet, async (ctx) => {
  ctx.body = _FangchaState.appInfo()
})

export const HealthSpecs = factory.buildSpecs()

export const HealthDocItem = {
  name: '健康检查',
  pageURL: '/api-docs/v1/health',
  specs: HealthSpecs,
}
