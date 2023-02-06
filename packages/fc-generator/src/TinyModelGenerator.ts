import { DBTableHandler } from 'fc-sql'
import { bigCamel, smallCamel } from '@fangcha/tools'
import * as fs from 'fs'
import { DBReadonlySchema, TSMapper } from './GeneratorCore'
import * as ejs from 'ejs'

export class TinyModelGenerator {
  schema: DBReadonlySchema

  public constructor(schema: DBReadonlySchema) {
    this.schema = schema
  }

  async makeTinyModelDefinition() {
    const schema = this.schema
    const database = schema.database

    const definition: TSMapper = {
      mapperName: bigCamel(schema.tableName),
      propList: [],
    }

    const specificProps: any = schema.specificProps || {}
    const tableName = schema.tableName
    const rawCols = await new DBTableHandler(database, tableName).getColumns()
    for (const rawCol of rawCols) {
      const columnName = rawCol.Field

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

      const rawColType = rawCol.Type
      const colIsNumber = rawColType.includes('int') || rawColType.includes('float') || rawColType.includes('double')

      const propKey = specificProps[columnName] ? specificProps[columnName] : smallCamel(columnName)
      definition.propList.push({
        propKey: propKey,
        propAttr: colIsNumber ? 'number' : 'string',
      })
    }

    const tmplFile = `${__dirname}/../templates/model.tiny.tmpl.ejs`
    const content = ejs.compile(fs.readFileSync(tmplFile, 'utf8'))(definition)
    if (schema.outputFile) {
      fs.writeFileSync(schema.outputFile, content)
    }
    return content
  }
}
