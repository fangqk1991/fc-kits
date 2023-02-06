import { SwaggerParameter, SwaggerSchema } from './SwaggerSchemas'

export class SwaggerConstants {
  public static PageOptions: SwaggerParameter[] = [
    {
      type: 'number',
      name: '_offset',
      in: 'query',
      description: '数据偏移量',
      default: 0,
    },
    {
      type: 'number',
      name: '_length',
      in: 'query',
      description: '数据长度，最大值 100，默认 10',
      default: 10,
    },
  ]

  public static AuthorizationParameter: SwaggerParameter = {
    name: 'Authorization',
    type: 'string',
    in: 'header',
    required: true,
  }

  public static makePageResultSchema(itemsSchema: SwaggerSchema) {
    return {
      type: 'object',
      properties: {
        offset: {
          type: 'number',
          example: 0,
          description: '偏移量',
        },
        length: {
          type: 'number',
          example: 10,
          description: '当前返回 items 长度',
        },
        totalCount: {
          type: 'number',
          example: 100,
          description: '匹配当前查询条件的数据总长度',
        },
        items: {
          type: 'array',
          items: itemsSchema,
        },
      },
    } as SwaggerSchema
  }
}
