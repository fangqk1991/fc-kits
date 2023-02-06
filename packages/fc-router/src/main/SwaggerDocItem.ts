import { SwaggerModelDefinitionV2 } from '@fangcha/swagger'
import { Spec } from './FCRouterModels'

export type PrivateSpecCheck = (spec?: Spec) => boolean

export interface SwaggerDocItem {
  name: string
  description?: string
  version?: string
  pageURL: string
  /**
   * @deprecated
   */
  jsonURL?: string
  specs: Spec[]
  privateSpecCheck?: PrivateSpecCheck
  models?: SwaggerModelDefinitionV2[]
}
