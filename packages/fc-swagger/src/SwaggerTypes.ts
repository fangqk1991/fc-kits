import { MapSwaggerSchema, SwaggerParameter, SwaggerSchema } from './SwaggerSchemas'

export interface SwaggerResponse {
  description: string
  schema: SwaggerSchema
}

export interface SwaggerMeta {
  summary: string
  tags: string[]
  description?: string
  parameters?: SwaggerParameter[]
  responses?: {
    200: SwaggerResponse
  }
}

export interface SwaggerProperty {
  name: string
  type: 'number' | 'string' | 'array' | 'boolean'
  filterable?: boolean
  items?: any
  info?: string
  example?: string
  default?: string | number
  enum?: string[]
}

export interface SwaggerModelDefinitionV2 {
  name: string
  schema: SwaggerSchema
}

export type MapSwaggerProperties<T> = Record<keyof T, SwaggerSchema>

export interface TypicalMapSwagger<T> extends MapSwaggerSchema {
  type: 'object'
  properties: MapSwaggerProperties<T>
}

export interface TypicalSwaggerModel<T> {
  name: string
  schema: TypicalMapSwagger<T>
}

export interface Api {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | string
  route: string
  description: string
  detailInfo?: any
  skipAuth?: boolean
  responseDemo?: any
  parameters?: SwaggerParameter[]
  responseSchemaRef?: SwaggerModelDefinitionV2 | string
}
