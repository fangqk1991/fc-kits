import * as ejs from 'ejs'
import * as fs from 'fs'
import { DBTableHandler, FCDatabase } from 'fc-sql'
import * as path from 'path'
import { smallCamel } from '@fangcha/tools'
import { DBConfig, DBModelSchema, ModelColumn } from './GeneratorCore'

function decoratePrimaryKey(value: any): string {
  if (Array.isArray(value)) {
    return '[' + value.map((item: any) => decoratePrimaryKey(item)).join(', ') + ']'
  }
  if (value === null) {
    return 'null'
  }
  if (typeof value === 'number') {
    return `${value}`
  }
  return `'${value}'`
}

function getRootDir(modelPath: string) {
  const items = modelPath.split('/src/')
  const levels = items[items.length - 1].split('/').length - 1
  return new Array(levels).fill('..').join('/')
}

export interface ModelData {
  decoratePrimaryKey(value: any): string
  getPropName(columnName: string): string
  rootDir: string
  dbName: string
  dbProp?: string
  className: string
  tableName: string
  autoIncrementKey: string
  primaryKey: string | string[]
  sqlCols: ModelColumn[]
  reloadOnAdded?: boolean
  reloadOnUpdated?: boolean
  extendPropertyList?: { name: string; type: string }[]
  customProps?: {
    columnDesc: string
    propName: string
  }[]
  others?: {}
}

/**
 * @description 模板语法请参考 EJS 文档: https://ejs.bootcss.com
 */
export class ModelGenerator {
  dbConfig: DBConfig
  tmplFile: string
  extTmplFile: string
  readonly: boolean = false

  /**
   * @description 定义默认的 DBConfig 和 tmplFile，若 DBModelSchema 中未定义 dbConfig / tmplFile，则使用此默认值
   */
  public constructor(options: { dbConfig: DBConfig; tmplFile: string; extTmplFile?: string; readonly?: boolean }) {
    this.dbConfig = options.dbConfig
    this.tmplFile = options.tmplFile
    this.readonly = !!options.readonly
    this.extTmplFile = options.extTmplFile || `${__dirname}/../templates/class.extends.model.ejs`
  }

  async generateData(schema: DBModelSchema) {
    if (schema.useAggregate) {
      return this.generateDataForAggregateSchema(schema)
    }
    const dbConfig = schema.dbConfig || this.dbConfig
    const instanceName = `${dbConfig.host}-${dbConfig.port}-${dbConfig.database}`
    const database = FCDatabase.instanceWithName(instanceName)
    database.init(dbConfig as any)

    const specificProps: any = schema.specificProps || {}
    const tableName = schema.tableName
    const readonly = schema.readonly !== undefined ? schema.readonly : this.readonly
    let primaryKey: any = schema.primaryKey || ''
    let autoIncrementKey = ''
    const rawCols = await new DBTableHandler(database, tableName).getColumns()
    if (schema.keepRawPropName) {
      for (const rawCol of rawCols) {
        const columnName = rawCol.Field
        specificProps[columnName] = columnName
      }
    }
    const sqlCols: ModelColumn[] = []
    for (const rawCol of rawCols) {
      const columnName = rawCol.Field

      if (!autoIncrementKey && rawCol.Extra.includes('auto_increment')) {
        autoIncrementKey = columnName
      }

      // 名为 rid | _rid 的列会被忽略
      if (!schema.forceUseRid && (columnName === 'rid' || columnName === '_rid')) {
        continue
      }

      if (schema.readableWhiteList && !schema.readableWhiteList.includes(columnName)) {
        continue
      }

      if (schema.readableBlackList && schema.readableBlackList.includes(columnName)) {
        continue
      }

      const remarks = rawCol.Comment
      let insertable = true
      let modifiable = true
      let isTimestamp = false
      let columnType = 'any'
      const nullable = rawCol.Null === 'YES'
      if (rawCol.Key === 'PRI' || rawCol.Key === 'UNI') {
        if (!primaryKey) {
          primaryKey = columnName
        }
        // uniqueKeyModifiable = false 时，Primary Key 和 Unique Key 不可进行修改
        modifiable = schema.uniqueKeyModifiable || false
      }

      let rawColType = rawCol.Type
      const colIsNumber = rawColType.includes('int') || rawColType.includes('float') || rawColType.includes('double')
      const colIsLongText = rawColType.includes('text')
      if (colIsNumber && rawColType !== 'tinyint(1)') {
        rawColType = rawColType.replace(/\(\d+\)/, '')
      }
      let defValue: any = rawCol.Default
      if (defValue === 'CURRENT_TIMESTAMP' && (rawCol.Type === 'timestamp' || rawCol.Type === 'datetime')) {
        defValue = null
        insertable = false
        if (rawCol.Extra.includes('on update CURRENT_TIMESTAMP')) {
          modifiable = false
        }
      } else if (colIsNumber && defValue !== null) {
        defValue = Number(defValue)
      } else if (colIsLongText && defValue === null) {
        // 为 TEXT 类型设置默认值
        defValue = ''
      }
      if (rawCol.Type === 'timestamp') {
        isTimestamp = true
      }

      if (colIsNumber) {
        columnType = 'number'
      } else {
        columnType = 'string'
      }

      if (nullable && !colIsLongText) {
        columnType = `${columnType} | null`
      }

      if (schema.insertableWhiteList) {
        insertable = schema.insertableWhiteList.includes(columnName)
      }

      if (schema.insertableBlackList && schema.insertableBlackList.includes(columnName)) {
        insertable = false
      }

      if (schema.forceInsertableWhiteList && schema.forceInsertableWhiteList.includes(columnName)) {
        insertable = true
      }

      if (schema.modifiableWhiteList) {
        modifiable = schema.modifiableWhiteList.includes(columnName)
      }

      if (schema.modifiableBlackList && schema.modifiableBlackList.includes(columnName)) {
        modifiable = false
      }

      if (schema.forceModifiableWhiteList && schema.forceModifiableWhiteList.includes(columnName)) {
        modifiable = true
      }

      const descriptionItems = [`[${rawColType}]`]
      if (remarks) {
        descriptionItems.push(remarks)
      }
      sqlCols.push({
        columnName: columnName,
        columnType: columnType,
        hasDefValue: nullable || defValue !== null,
        defValue: defValue,
        propDescription: descriptionItems.join(' '),
        nullable: nullable,
        insertable: !readonly && insertable,
        modifiable: !readonly && modifiable,
        isTimestamp: isTimestamp,
      })
    }

    const className = (schema.outputFile.split('/').pop() as string).split('.')[0]

    return {
      decoratePrimaryKey: decoratePrimaryKey,
      getPropName: (columnName: string) => {
        if (specificProps[columnName]) {
          return specificProps[columnName]
        }
        return smallCamel(columnName)
      },
      rootDir: getRootDir(schema.outputFile),
      dbProp: schema.dbProp,
      dbName: smallCamel(dbConfig.database),
      className: className,
      tableName: tableName,
      autoIncrementKey: autoIncrementKey,
      primaryKey: primaryKey,
      sqlCols: sqlCols,
      reloadOnAdded: schema.reloadOnAdded,
      reloadOnUpdated: schema.reloadOnUpdated,
      extendPropertyList: schema.extendPropertyList || [],
      others: schema.extrasSchemaData || {},
    } as ModelData
  }

  async generateDataForAggregateSchema(schema: DBModelSchema) {
    const dbConfig = schema.dbConfig || this.dbConfig
    const instanceName = `${dbConfig.host}-${dbConfig.port}-${dbConfig.database}`
    const database = FCDatabase.instanceWithName(instanceName)
    database.init(dbConfig as any)

    const className = (schema.outputFile.split('/').pop() as string).split('.')[0]

    return {
      decoratePrimaryKey: decoratePrimaryKey,
      getPropName: (columnName: string) => columnName,
      rootDir: getRootDir(schema.outputFile),
      dbProp: schema.dbProp,
      dbName: smallCamel(dbConfig.database),
      className: className,
      tableName: schema.tableName,
      primaryKey: schema.primaryKey,
      autoIncrementKey: '',
      sqlCols: [],
      reloadOnAdded: schema.reloadOnAdded,
      reloadOnUpdated: schema.reloadOnUpdated,
      extendPropertyList: schema.extendPropertyList || [],
      customProps: schema.customColumnDescList!.map((item) => {
        return {
          columnDesc: item,
          propName: item.match(/AS (\w+)$/i)![1],
        }
      }),
    } as ModelData
  }

  buildModel(schema: DBModelSchema, data: ModelData) {
    const tmplFile = schema.tmplFile || this.tmplFile
    const content = ejs.compile(fs.readFileSync(tmplFile, 'utf8'))(data)
    fs.writeFileSync(schema.outputFile, content)

    const override = false
    if (schema.extFile) {
      if (fs.existsSync(schema.extFile) && !override) {
        return
      }
      const modelName = (schema.outputFile.split('/').pop() as string).split('.')[0]
      const className = (schema.extFile.split('/').pop() as string).split('.')[0]
      const relativePath = path.relative(path.dirname(schema.extFile), path.dirname(schema.outputFile))
      const content = ejs.compile(fs.readFileSync(this.extTmplFile, 'utf8'))({
        modelName: modelName,
        className: className,
        relativePath: relativePath,
      })
      fs.writeFileSync(schema.extFile, content)
    }
  }
}
