import { SwaggerMeta, SwaggerModelDefinitionV2, SwaggerParameter } from '@fangcha/swagger'
import { Spec } from './FCRouterModels'

enum AuthType {
  None = 'None',
  BasicAuth = 'BasicAuth',
}

interface Options {
  title: string
  description: string
  version: string
  baseURL: string
}

export class SwaggerBuilder {
  public readonly swaggerVersion = '2.0'
  public readonly summaryInfo = {
    title: 'Swagger Title',
    description: 'Swagger Description',
    version: '0.0.1',
  }
  public readonly paths: { [p: string]: any }
  public readonly models: { [p: string]: any }
  public authType: AuthType = AuthType.None
  public baseURL: string = ''

  public constructor(options?: Options) {
    this.paths = {}
    this.models = {}
    if (options) {
      this.setTitle(options.title)
      this.setDescription(options.description)
      this.setVersion(options.version)
      this.setBaseURL(options.baseURL)
    }
  }

  public useBasicAuth() {
    this.authType = AuthType.BasicAuth
  }

  public buildJSON() {
    const data: any = {
      swagger: this.swaggerVersion,
      info: this.summaryInfo,
      paths: this.paths,
      definitions: this.models,
    }
    if (this.authType === AuthType.BasicAuth) {
      data.securityDefinitions = {
        basicAuth: {
          type: 'basic',
        },
      }
    }
    if (this.baseURL) {
      const match = this.baseURL.match(/^(https?):\/\/([^/]*)(\/.*)?$/)
      if (match) {
        data.schemes = [match[1]]
        data.host = match[2]
        data.basePath = match[3]
      }
    }
    return data
  }

  public setTitle(content: string) {
    this.summaryInfo.title = content
    return this
  }

  public setDescription(content: string) {
    this.summaryInfo.description = content
    return this
  }

  public setVersion(content: string) {
    this.summaryInfo.version = content
    return this
  }

  public setBaseURL(baseURL: string) {
    this.baseURL = baseURL
    return this
  }

  public addSpec(...specs: Spec[]) {
    specs.forEach((spec) => {
      const swaggerMeta = spec['swaggerMeta']
      const router = spec.path as string
      const items = router.match(/:([\w-]+)/g)
      const path = router.replace(/:([\w-]+)/g, (_: any, paramKey: string) => {
        return `{${paramKey}}`
      })

      const parameters: SwaggerParameter[] = []
      if (items) {
        for (const item of items) {
          parameters.push({
            type: 'string',
            name: item.replace(/:/g, ''),
            in: 'path',
          })
        }
      }

      const method = spec.method as string
      if (!this.paths[path]) {
        this.paths[path] = {}
      }
      const responses = {}
      const entity: SwaggerMeta | any = {
        responses: Object.assign(responses, swaggerMeta.responses || {}),
        summary: swaggerMeta.summary,
        tags: swaggerMeta.tags,
        parameters: [...parameters, ...(swaggerMeta.parameters || [])],
      }
      if (swaggerMeta.description) {
        entity.description = swaggerMeta.description
      }
      if (this.authType === AuthType.BasicAuth) {
        entity.security = [
          {
            basicAuth: [],
          },
        ]
      }
      this.paths[path][method] = entity
    })
    return this
  }

  public addModel(...models: SwaggerModelDefinitionV2[]) {
    for (const model of models) {
      this.models[model.name] = model.schema
    }
    return this
  }
}
