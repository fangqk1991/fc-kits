import { SwaggerParameter, SwaggerSchema } from './SwaggerSchemas'
import { SwaggerModelDefinitionV2, SwaggerResponse } from './SwaggerTypes'

const _transferExampleToSwaggerSchema = (obj: any): SwaggerSchema => {
  const objType = typeof obj
  if (objType === 'number' || objType === 'string' || objType === 'boolean') {
    return {
      type: objType,
      example: obj,
    }
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return {
        type: 'string',
        example: 'Error',
      }
    }
    return {
      type: 'array',
      items: _transferExampleToSwaggerSchema(obj[0]),
    }
  }

  const properties: {
    [p: string]: SwaggerSchema
  } = {}
  Object.keys(obj).forEach((key) => {
    properties[key] = _transferExampleToSwaggerSchema(obj[key])
  })
  return {
    type: 'object',
    properties: properties,
  }
}

export const buildSwaggerResponse = (example: any) => {
  return {
    200: {
      description: 'successful operation',
      schema: _transferExampleToSwaggerSchema(example),
    },
  } as {
    200: SwaggerResponse
  }
}

export const buildSwaggerSchema = (example: any) => {
  return _transferExampleToSwaggerSchema(example)
}

export const makeSwaggerRefSchema = (refModel: string | SwaggerModelDefinitionV2) => {
  if (typeof refModel !== 'string') {
    refModel = refModel.name
  }
  return {
    $ref: `#/definitions/${refModel}`,
  }
}

export const makeSwaggerBodyDataParameters = (refModel: SwaggerModelDefinitionV2, description?: string) => {
  return [
    {
      name: 'bodyData',
      type: 'object',
      in: 'body',
      description: description || '',
      schema: makeSwaggerRefSchema(refModel),
    },
  ] as SwaggerParameter[]
}
