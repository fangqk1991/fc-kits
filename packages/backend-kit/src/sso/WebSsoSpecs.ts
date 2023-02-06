import assert from '@fangcha/assert'
import * as jsonwebtoken from 'jsonwebtoken'
import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { KitSsoApis } from '../apis'
import { CustomRequestFollower } from '../main'
import { OAuthClient } from '@fangcha/tools/lib/oauth-client'
import { _SessionApp, FangchaSession } from '@fangcha/router/lib/session'
import { _SsoState } from './_SsoState'
import { Context } from 'koa'

const makeOAuthClient = (ctx: Context) => {
  let callbackUri = _SsoState.ssoProtocol.oauthConfig.callbackUri
  const matches = _SsoState.ssoProtocol.oauthConfig.callbackUri.match(/^(https?:\/\/.*?)\//)
  if (matches) {
    const session = ctx.session as FangchaSession
    callbackUri = session.correctUrl(callbackUri)
  }
  return new OAuthClient(
    {
      ..._SsoState.ssoProtocol.oauthConfig,
      callbackUri: callbackUri,
    },
    CustomRequestFollower
  )
}

const factory = new SpecFactory('SSO', { skipAuth: true })

factory.prepare(KitSsoApis.Login, async (ctx) => {
  const session = ctx.session as FangchaSession
  const ssoProxy = makeOAuthClient(ctx)
  ctx.redirect(ssoProxy.getAuthorizeUri(session.getRefererUrl()))
})

factory.prepare(KitSsoApis.Logout, async (ctx) => {
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, '', {
    maxAge: 0,
  })
  const session = ctx.session as FangchaSession
  const ssoProxy = makeOAuthClient(ctx)
  ctx.redirect(ssoProxy.buildLogoutUrl(session.getRefererUrl()))
})

factory.prepare(KitSsoApis.SSOHandle, async (ctx) => {
  const { code, state: redirectUri } = ctx.request.query
  assert.ok(!!code && typeof code === 'string', 'code invalid.')
  assert.ok(typeof redirectUri === 'string', 'state/redirectUri invalid')
  const ssoProxy = makeOAuthClient(ctx)
  const accessToken = await ssoProxy.getAccessTokenFromCode(code as string)
  const userInfo = await _SsoState.ssoProtocol.getUserInfo(accessToken)
  const aliveSeconds = 24 * 3600
  const jwt = jsonwebtoken.sign(userInfo, _SessionApp.jwtProtocol.jwtSecret, { expiresIn: aliveSeconds })
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, jwt, { maxAge: aliveSeconds * 1000 })
  const session = ctx.session as FangchaSession
  ctx.redirect(session.correctUrl(redirectUri as string))
})

export const WebSsoSpecs = factory.buildSpecs()

export const SsoSpecDocItem: SwaggerDocItem = {
  name: 'SSO',
  pageURL: '/api-docs/v1/sso-sdk',
  specs: WebSsoSpecs,
}
