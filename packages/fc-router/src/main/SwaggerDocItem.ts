import { SwaggerModelDefinitionV2, SwaggerResource } from '@fangcha/swagger'
import { Spec } from './FCRouterModels'

export type PrivateSpecCheck = (spec?: Spec) => boolean

export interface SwaggerDocItem {
  name: string
  description?: string
  version?: string
  pageURL: string
  specs: Spec[]
  privateSpecCheck?: PrivateSpecCheck
  models?: SwaggerModelDefinitionV2[]
}

export interface RawSwaggerDocItem {
  pageURL: string
  swaggerJSON: any
  resourceOptions?: Partial<SwaggerResource>
}
