import { MapSwaggerSchema, SwaggerParameter } from './SwaggerSchemas'

export const UpdateTimeSchema: MapSwaggerSchema = {
  type: 'object',
  properties: {
    iso8601: {
      type: 'string',
      example: '2019-11-15T14:27:42+08:00',
    },
    timestamp: {
      type: 'number',
      example: 1573799262,
    },
  },
}

export const PageBasicParameters: SwaggerParameter[] = [
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
    description: '数据长度，最大值 10000',
    default: 100,
  },
]

export const PageFilterParameters: SwaggerParameter[] = [
  ...PageBasicParameters,
  {
    type: 'string',
    name: '_sortKey',
    in: 'query',
    description: '用于排序的键',
    default: 'updateTime',
  },
  {
    type: 'string',
    name: '_sortDirection',
    in: 'query',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  },
]

export const UpdateTsFilterParameters: SwaggerParameter[] = [
  {
    type: 'number',
    name: '_updateTs.GE',
    in: 'query',
    description: '更新时间下界（包含），Unix 时间戳',
  },
  {
    type: 'number',
    name: '_updateTs.GT',
    in: 'query',
    description: '更新时间下界（不包含），Unix 时间戳',
  },
  {
    type: 'number',
    name: '_updateTs.LE',
    in: 'query',
    description: '更新时间上界（包含），Unix 时间戳',
  },
  {
    type: 'number',
    name: '_updateTs.LT',
    in: 'query',
    description: '更新时间上界（不包含），Unix 时间戳',
  },
]
