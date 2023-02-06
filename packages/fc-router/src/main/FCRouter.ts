import * as KoaRouter from '@koa/router'
import assert from '@fangcha/assert'
import { Handler, Spec } from './FCRouterModels'

export class SpecFormatter {
  public static formatSpec(spec: Spec) {
    assert.ok(!!spec, 'missing spec')

    const ok = typeof spec.path === 'string' || spec.path instanceof RegExp
    assert.ok(ok, 'invalid route path')

    if (!Array.isArray(spec.handler)) {
      spec.handler = [spec.handler]
    }

    if (spec.pre && !Array.isArray(spec.pre)) {
      spec.pre = [spec.pre]
    }

    assert.ok(!!spec.method, 'missing route methods')
    if (typeof spec.method === 'string') {
      spec.method = spec.method.split(' ').map((item) => item.trim().toLowerCase())
    }

    return spec
  }
}

export class FCRouter {
  router!: KoaRouter

  constructor() {
    this.router = new KoaRouter()
  }

  public addRoute(spec: Spec) {
    this._addRoute(spec)
    return this
  }

  public addRoutes(specs: Spec[]) {
    specs.forEach((spec) => {
      this._addRoute(spec)
    })
    return this
  }

  public middleware() {
    return this.router.routes()
  }

  private _addRoute(spec: Spec) {
    SpecFormatter.formatSpec(spec)

    const handlers: Handler[] = []
    if (spec.pre) {
      handlers.push(...(spec.pre as Handler[]))
    }
    handlers.push(...(spec.handler as Handler[]))

    const methods = spec.method as string[]
    methods.forEach((method) => {
      this.router[method](spec.path, ...handlers)
    })
  }
}
