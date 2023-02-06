import * as Koa from 'koa'
import { WriteLogMiddlewareBuilder } from '@fangcha/logger/lib/koa'
import { BasicAuthProtocol, JWTProtocol, RouterApp } from '@fangcha/router'
import { FangchaSession } from '@fangcha/router/lib/session'

export interface RouterSdkOptions {
  baseURL: string

  backendPort: number

  routerApp?: RouterApp
  /**
   * @default FangchaSession
   */
  Session?: typeof FangchaSession
  /**
   * @default execute ctx.session.auth()
   */
  handleAuth?: (ctx: Koa.Context) => Promise<void>
  onRequestError?: (err: Error, ctx: Koa.Context) => void
  customWriteLogMiddlewareBuilder?: WriteLogMiddlewareBuilder
  onKoaAppLaunched?: () => void
  serverTimeout?: number

  /**
   * @description If using jwtProtocol, Session default will be FangchaAdminSession
   */
  jwtProtocol?: JWTProtocol
  /**
   * @description If using basicAuthProtocol, Session default will be FangchaOpenSession
   */
  basicAuthProtocol?: BasicAuthProtocol
}
