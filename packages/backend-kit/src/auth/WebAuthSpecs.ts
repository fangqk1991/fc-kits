import { SpecFactory, SwaggerDocItem } from '@fangcha/router'
import { KitAuthApis } from '../apis'
import { _SessionApp, FangchaSession } from '@fangcha/router/lib/session'
import * as jsonwebtoken from 'jsonwebtoken'
import { _WebAuthState } from './_WebAuthState'
import { AccountErrorPhrase, AuthMode, CarrierType, VisitorCoreInfo } from '@fangcha/account/lib/common/models'
import { AppException } from '@fangcha/app-error'
import assert from '@fangcha/assert'
import { OAuthClient } from '@fangcha/tools/lib/oauth-client'
import { CustomRequestFollower } from '../main'
import { Context } from 'koa'
import { axiosGET } from '@fangcha/app-request'

const makeOAuthClient = (ctx: Context) => {
  const ssoAuth = _WebAuthState.authProtocol.ssoAuth!
  assert.ok(!!ssoAuth, `ssoAuth invalid.`, 500)
  let callbackUri = ssoAuth.callbackUri
  const matches = ssoAuth.callbackUri.match(/^(https?:\/\/.*?)\//)
  if (matches) {
    const session = ctx.session as FangchaSession
    callbackUri = session.correctUrl(callbackUri)
  }
  return new OAuthClient(
    {
      ...ssoAuth,
      callbackUri: callbackUri,
    },
    CustomRequestFollower
  )
}

const factory = new SpecFactory('Auth', { skipAuth: true })

factory.prepare(KitAuthApis.Login, async (ctx) => {
  const params = ctx.request.body as {
    email: string
    password: string
  }
  params.email = (params.email || '').trim()
  const userInfo: VisitorCoreInfo = {
    accountUid: params.email,
    email: params.email,
  }
  let passed = false
  const simpleAuth = _WebAuthState.authProtocol.simpleAuth!
  assert.ok(_WebAuthState.authProtocol.authMode === AuthMode.Simple && !!simpleAuth, `simpleAuth invalid.`, 500)
  const userData = simpleAuth.retainedUserData || {}
  if (params.email in userData) {
    if (userData[params.email] !== params.password) {
      throw AppException.exception(AccountErrorPhrase.PasswordIncorrect)
    }
    passed = true
  }
  const accountServer = simpleAuth.accountServer
  if (!passed && accountServer) {
    const carrier = await accountServer.findCarrier(CarrierType.Email, params.email)
    if (!carrier) {
      throw AppException.exception(AccountErrorPhrase.AccountNotExists)
    }
    const account = await accountServer.findAccount(carrier.accountUid)
    account.assertPasswordCorrect(params.password)
    userInfo.accountUid = account.accountUid
    passed = true
  }
  if (!passed) {
    throw AppException.exception(AccountErrorPhrase.PasswordIncorrect)
  }
  const aliveSeconds = 24 * 3600
  const jwt = jsonwebtoken.sign(userInfo, _SessionApp.jwtProtocol.jwtSecret, { expiresIn: aliveSeconds })
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, jwt, { maxAge: aliveSeconds * 1000 })
  ctx.status = 200
})

factory.prepare(KitAuthApis.Logout, async (ctx) => {
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, '', {
    maxAge: 0,
  })
  ctx.status = 200
})

factory.prepare(KitAuthApis.RedirectLogin, async (ctx) => {
  const session = ctx.session as FangchaSession
  if (_WebAuthState.authProtocol.authMode === AuthMode.SSO) {
    const ssoProxy = makeOAuthClient(ctx)
    ctx.redirect(ssoProxy.getAuthorizeUri(session.getRefererUrl()))
  } else {
    ctx.redirect(`/login?redirectUri=${encodeURIComponent(session.getRefererUrl())}`)
  }
})

factory.prepare(KitAuthApis.RedirectLogout, async (ctx) => {
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, '', {
    maxAge: 0,
  })
  const session = ctx.session as FangchaSession
  const refererUrl = session.getRefererUrl()

  if (_WebAuthState.authProtocol.authMode === AuthMode.SSO) {
    const ssoProxy = makeOAuthClient(ctx)
    ctx.redirect(ssoProxy.buildLogoutUrl(refererUrl))
  } else {
    ctx.redirect(refererUrl)
  }
})

factory.prepare(KitAuthApis.RedirectHandleSSO, async (ctx) => {
  const { code, state: redirectUri } = ctx.request.query
  assert.ok(!!code && typeof code === 'string', 'code invalid.')
  assert.ok(typeof redirectUri === 'string', 'state/redirectUri invalid')

  const ssoProxy = makeOAuthClient(ctx)
  const accessToken = await ssoProxy.getAccessTokenFromCode(code as string)
  const ssoAuth = _WebAuthState.authProtocol.ssoAuth!

  const request = axiosGET(ssoAuth.userInfoURL)
  request.addHeader('Authorization', `Bearer ${accessToken}`)
  const userInfo = await request.quickSend()
  const aliveSeconds = 24 * 3600
  const jwt = jsonwebtoken.sign(userInfo, _SessionApp.jwtProtocol.jwtSecret, { expiresIn: aliveSeconds })
  ctx.cookies.set(_SessionApp.jwtProtocol.jwtKey, jwt, { maxAge: aliveSeconds * 1000 })
  const session = ctx.session as FangchaSession
  ctx.redirect(session.correctUrl(redirectUri as string))
})

export const WebAuthSpecs = factory.buildSpecs()

export const WebAuthSpecDocItem: SwaggerDocItem = {
  name: 'Web Auth',
  pageURL: '/api-docs/v1/auth-sdk',
  specs: WebAuthSpecs,
}
