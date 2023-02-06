export interface SwaggerParameter {
  type: 'number' | 'string' | 'enum' | 'object' | 'array' | 'file'
  name: string
  in: 'path' | 'query' | 'body' | 'header' | 'formData'
  description?: string
  required?: boolean
  enum?: string[]
  default?: string | number
  properties?: {
    [p: string]: SwaggerSchema
  }
  schema?: SwaggerSchema
  items?: SwaggerSchema
}

export interface NormalSwaggerSchema {
  type: 'number' | 'integer' | 'string' | 'boolean' | 'null'
  example?: string | number | boolean | null
  description?: string
}

export interface EnumSwaggerSchema {
  type: 'enum'
  enum: any[]
  example?: string | number | boolean | null
  description?: string
}

export interface ArraySwaggerSchema {
  type: 'array'
  items: SwaggerSchema
}

export interface MapSwaggerSchema {
  type: 'object'
  required?: string[]
  properties: {
    [p: string]: SwaggerSchema
  }
}

export interface RefSwaggerSchema {
  $ref: string
}

export type RawSwaggerSchema = NormalSwaggerSchema | EnumSwaggerSchema | ArraySwaggerSchema | MapSwaggerSchema

export interface ExtendsSchema {
  allOf: (RawSwaggerSchema | RefSwaggerSchema)[]
}

export type SwaggerSchema = RawSwaggerSchema | RefSwaggerSchema | ExtendsSchema
