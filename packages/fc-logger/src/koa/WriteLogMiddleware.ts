import { Context } from 'koa'
import { AppException, RedirectBreak } from '@fangcha/app-error'

type NormalHandler = (ctx: Context) => void | Promise<void>
type ErrorHandler = (ctx: Context, err: Error) => void | Promise<void>

export class WriteLogMiddlewareBuilder {
  private _skippingUris: { [p: string]: true }
  private _normalHandler?: NormalHandler
  private _errorHandler?: ErrorHandler

  public constructor() {
    this._skippingUris = {
      '/api/health/ping': true,
    }
  }

  public setNormalHandler(handler: NormalHandler) {
    this._normalHandler = handler
    return this
  }

  public setErrorHandler(handler: ErrorHandler) {
    this._errorHandler = handler
    return this
  }

  public skipUrl(url: string) {
    this._skippingUris[url] = true
    return this
  }

  public build() {
    /**
     * @description 请确保 ctx.logger 已被赋予 Logger 对象
     */
    return async (ctx: Context, next: Function) => {
      const { method, url, hostname } = ctx.request

      if (!this._skippingUris[url]) {
        ctx.logger.info(`[Start] 200 0 "${method} ${url} ${hostname}"`)
      }

      const start = Date.now()
      try {
        await next()

        const { method, url, hostname } = ctx.request
        ctx.duration = Date.now() - start
        if (!this._skippingUris[url]) {
          ctx.logger.info(`[Completed] ${ctx.status} ${ctx.duration / 1000} "${method} ${url} ${hostname}"`)
          if (this._normalHandler) {
            await this._normalHandler(ctx)
          }
        }
      } catch (err: any) {
        ctx.status = err.statusCode || 500
        ctx.body = err.message
        if (err.name === AppException.name) {
          ctx.body = (err as AppException).errorBody
        } else if (err.name === RedirectBreak.name) {
          ctx.redirect((err as RedirectBreak).redirectUri)
        }
        const { method, url, hostname } = ctx.request
        ctx.duration = Date.now() - start

        if (this._errorHandler) {
          await this._errorHandler(ctx, err)
        }
        ctx.logger.info(`[Completed] ${ctx.status} ${ctx.duration / 1000} "${method} ${url} ${hostname}"`)
        ctx.logger.error(err.message)
        ctx.logger.error(err)
        ctx.app.emit('error', err, ctx)
      }
    }
  }
}

export const WriteLogMiddleware = new WriteLogMiddlewareBuilder().build()
