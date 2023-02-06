import { ModelGenerator } from './ModelGenerator'
import { FCDatabase } from 'fc-sql'

export interface DBConfig {
  host: string
  port: number
  dialect: string
  database: string
  username: string
  password: string
}

export interface DBModelSchema {
  generator?: ModelGenerator
  tableName: string
  dbProp?: string
  outputFile: string
  extFile?: string
  dbConfig?: DBConfig
  tmplFile?: string
  readonly?: boolean
  reloadOnAdded?: boolean
  reloadOnUpdated?: boolean
  primaryKey?: string | string[]
  readableWhiteList?: string[]
  readableBlackList?: string[]
  insertableWhiteList?: string[]
  forceInsertableWhiteList?: string[]
  forceModifiableWhiteList?: string[]
  insertableBlackList?: string[]
  modifiableWhiteList?: string[]
  modifiableBlackList?: string[]
  extendPropertyList?: { name: string; type: string }[]
  // For AggregateSchema
  useAggregate?: boolean
  customColumnDescList?: string[]
  /**
   * SQL Column Name => Specific property
   */
  specificProps?: { [p: string]: string }
  keepRawPropName?: boolean
  uniqueKeyModifiable?: boolean
  extrasSchemaData?: {
    [p: string]: string
  }
  forceUseRid?: boolean
}

export interface ModelColumn {
  columnName: string
  columnType: string
  hasDefValue: boolean
  defValue: string | number | null
  propDescription: string
  nullable: boolean
  insertable: boolean
  modifiable: boolean
  isTimestamp?: boolean
}

export interface DBReadonlySchema {
  database: FCDatabase
  tableName: string
  readableWhiteList?: string[]
  readableBlackList?: string[]
  specificProps?: { [p: string]: string }
  forceUseRid?: boolean
  outputFile?: string
}

export interface TSMapperProp {
  propKey: string
  propAttr: 'string' | 'number'
}

export interface TSMapper {
  mapperName: string
  propList: TSMapperProp[]
}
