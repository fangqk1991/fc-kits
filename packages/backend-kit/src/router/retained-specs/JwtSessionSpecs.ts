import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { FangchaJwtSession } from '@fangcha/router/lib/session'
import { RetainedSessionApis } from '../../common/apis'
import { SessionInfo } from '../../common/models'
import { _FangchaState } from '../../main'

const factory = new SpecFactory('JWT Session')

factory.prepare(RetainedSessionApis.SessionInfoGet, async (ctx) => {
  const session = ctx.session as FangchaJwtSession
  const data: SessionInfo = {
    env: _FangchaState.env,
    tags: _FangchaState.tags,
    codeVersion: _FangchaState.codeVersion,
    config: _FangchaState.frontendConfig,
    userInfo: null,
  }
  if (session.checkLogin()) {
    data.userInfo = session.getAuthInfo()
  }
  ctx.body = data
})

factory.prepare(RetainedSessionApis.UserInfoGet, async (ctx) => {
  const session = ctx.session as FangchaJwtSession
  ctx.body = session.curUserInfo()
})

export const JwtSessionSpecs = factory.buildSpecs()

export const JwtSessionSpecDocItem: SwaggerDocItem = {
  name: 'Session',
  pageURL: '/api-docs/v1/session-sdk',
  specs: JwtSessionSpecs,
}
