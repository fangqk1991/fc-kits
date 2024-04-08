import * as Koa from 'koa'
import { RawSwaggerDocItem, SwaggerDocItem } from './SwaggerDocItem'
import { SwaggerBuilder } from './SwaggerBuilder'
import { FCRouter } from './FCRouter'
import { Spec } from './FCRouterModels'
import { SwaggerResource } from '@fangcha/swagger'

export interface RouterAppParams {
  baseURL?: string
  version?: string
  description?: string
  useBasicAuth?: boolean
  docItems: SwaggerDocItem[]
  rawSwaggerItems?: RawSwaggerDocItem[]
  swaggerResource?: SwaggerResource
}

const _defaultPrivateSpecCheck = (spec: Spec) => {
  return !spec['skipAuth']
}

export class RouterApp {
  private readonly params: RouterAppParams

  constructor(params: RouterAppParams) {
    this.params = params
  }

  public updateParams(params: Partial<RouterAppParams>) {
    Object.assign(this.params, params)
  }

  public addDocItem(...docItems: SwaggerDocItem[]) {
    for (const docItem of docItems) {
      this.params.docItems.push(docItem)
    }
    return this
  }

  public addRawSwaggerDocItem(...docItems: RawSwaggerDocItem[]) {
    this.params.rawSwaggerItems = this.params.rawSwaggerItems || []
    for (const docItem of docItems) {
      this.params.rawSwaggerItems.push(docItem)
    }
    return this
  }

  private _preHandleMiddlewares: Koa.Middleware[] = []
  public addPreHandleMiddleware(middleware: Koa.Middleware) {
    this._preHandleMiddlewares.push(middleware)
    return this
  }
  public getPreHandleMiddlewares() {
    return this._preHandleMiddlewares
  }

  private _middlewaresBeforeInit: Koa.Middleware[] = []
  public addMiddlewareBeforeInit(middleware: Koa.Middleware) {
    this._middlewaresBeforeInit.push(middleware)
    return this
  }
  public getMiddlewaresBeforeInit() {
    return this._middlewaresBeforeInit
  }

  public makePrivateRouterMiddleware() {
    const privateSpecs = this.params.docItems.reduce((prev: Spec[], cur) => {
      const privateSpecCheck = cur.privateSpecCheck || _defaultPrivateSpecCheck
      return prev.concat(cur.specs.filter((spec) => privateSpecCheck(spec)))
    }, [])
    const router = new FCRouter()
    router.addRoutes(privateSpecs)
    return router.middleware()
  }

  public makePublicRouterMiddleware() {
    const publicSpecs = this.params.docItems.reduce((prev: Spec[], cur) => {
      const privateSpecCheck = cur.privateSpecCheck || _defaultPrivateSpecCheck
      return prev.concat(cur.specs.filter((spec) => !privateSpecCheck(spec)))
    }, [])
    const router = this.makeSwaggerRouter()
    router.addRoutes(publicSpecs)
    return router.middleware()
  }

  private makeSwaggerRouter() {
    const myRouter = new FCRouter()
    this.params.docItems.forEach((item) => {
      const baseURL = this.params.baseURL || ''
      const swagger = new SwaggerBuilder({
        title: item.name,
        description: item.description || this.params.description || '',
        version: item.version || this.params.version || '1.0.0',
        baseURL: baseURL,
      })
      if (this.params.useBasicAuth) {
        swagger.useBasicAuth()
      }
      swagger.addSpec(...item.specs)
      if (item.models) {
        swagger.addModel(...item.models)
      }
      myRouter.addRawSwaggerDocItem({
        pageURL: item.pageURL,
        swaggerJSON: swagger.buildJSON(),
        resourceOptions: this.params.swaggerResource,
      })
    })
    if (this.params.rawSwaggerItems) {
      this.params.rawSwaggerItems.forEach((item) => myRouter.addRawSwaggerDocItem(item))
    }
    return myRouter
  }
}
