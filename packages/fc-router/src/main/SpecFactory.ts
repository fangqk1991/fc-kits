import * as assert from 'assert'
import { Api, buildSwaggerResponse, makeSwaggerRefSchema } from '@fangcha/swagger'
import { Handler, Spec } from './FCRouterModels'

type RouteTransform = (route: string) => string

interface Options {
  skipAuth?: boolean
  permission?: string
  routeTransform?: RouteTransform
}

export class SpecFactory {
  public readonly category: string
  public readonly builders: SpecBuilder[]
  public readonly defaultOptions: Options
  public readonly preHandlers: Handler[] = []

  public constructor(category: string, defaultOptions: Options = { skipAuth: false }) {
    this.category = category
    this.builders = []
    this.defaultOptions = defaultOptions
  }

  public addPreHandler(handler: Handler) {
    this.preHandlers.push(handler)
    return this
  }

  public prepare(api: Api, handler?: Handler) {
    const builder = new SpecBuilder(this, api)
    if (handler) {
      const realHandlers: Handler[] = [...this.preHandlers]
      if (Array.isArray(handler)) {
        realHandlers.push(...handler)
      } else {
        realHandlers.push(handler)
      }
      builder.handle(realHandlers)
    }
    if (this.defaultOptions.skipAuth) {
      builder.skipAuth()
    }
    if (this.defaultOptions.permission) {
      builder.setPermission(this.defaultOptions.permission)
    }
    if (this.defaultOptions.routeTransform) {
      builder.setRouteTransform(this.defaultOptions.routeTransform)
    }
    this.builders.push(builder)
    return builder
  }

  public buildSpecs() {
    return this.builders.map((builder) => builder.build())
  }
}

class SpecBuilder {
  private readonly factory: SpecFactory
  private readonly _api!: Api
  private _handler!: Handler
  private _description = ''
  private _routeTransform?: RouteTransform
  public extras: any = {}

  public constructor(factory: SpecFactory, api: Api) {
    this.factory = factory
    this._api = api
  }

  public handle(handler: Handler) {
    this._handler = handler
    return this
  }

  public setPermission(permissionKey: string) {
    this.extras.require = permissionKey
    return this
  }

  public skipAuth() {
    this.extras.skipAuth = true
    return this
  }

  public setRouteTransform(transform: RouteTransform) {
    this._routeTransform = transform
    return this
  }

  public setDescription(description: string) {
    this._description = description
    return this
  }

  public addExtras(extras: Partial<Spec>) {
    Object.assign(this.extras, extras)
    return this
  }

  public build(): Spec {
    assert.ok(!!this._api, 'Spec 构造有误，Api 必须设置')
    assert.ok(!!this._handler, 'Spec 构造有误，Handler 必须设置')

    if (this.extras.skipAuth === undefined) {
      this.extras.skipAuth = this._api.skipAuth
    }

    const infos: string[] = []
    if (this.extras.require) {
      infos.push(`**需要 ${this.extras.require} 权限**`)
    }
    if (this.extras.skipAuth) {
      infos.push(`无需 jwt 验证`)
    }
    if (this._description) {
      infos.push(this._description)
    }
    if (this._api.detailInfo) {
      infos.push(this._api.detailInfo)
    }
    const detailInfo = infos.join('\n')

    const spec: Spec = {
      // TODO: 暂时使用 toLowerCase 兼容现有 koa 设定
      method: this._api.method.toLowerCase(),
      path: this._routeTransform ? this._routeTransform(this._api.route) : this._api.route,
      swaggerMeta: {
        summary: this._api.description,
        description: detailInfo.replace(/\n/g, '\n\n'),
        tags: [this.factory.category],
        parameters: [...(this._api.parameters || [])],
      },
      handler: this._handler,
      ...this.extras,
    }
    if (this._api.responseDemo !== undefined) {
      spec['swaggerMeta']['responses'] = buildSwaggerResponse(this._api.responseDemo)
    }
    if (this._api.responseSchemaRef !== undefined) {
      spec['swaggerMeta']['responses'] = {
        200: {
          description: 'successful operation',
          schema: makeSwaggerRefSchema(this._api.responseSchemaRef),
        },
      }
    }
    return spec
  }

  public removeRequiredPermission() {
    delete this.extras.require
    return this
  }
}
