import { DBTableHandler } from 'fc-sql'
import { bigCamel, smallCamel } from '@fangcha/tools'
import { MapSwaggerSchema, SwaggerModelDefinitionV2 } from '@fangcha/swagger'
import * as fs from 'fs'
import { DBReadonlySchema } from './GeneratorCore'

export class SwaggerGenerator {
  schema: DBReadonlySchema

  public constructor(schema: DBReadonlySchema) {
    this.schema = schema
  }

  async makeSwaggerDefinition() {
    const schema = this.schema
    const database = schema.database

    const definition: SwaggerModelDefinitionV2 = {
      name: `Swagger_${bigCamel(schema.tableName)}`,
      schema: {
        type: 'object',
        properties: {},
      },
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
      const mapSchema = definition.schema as MapSwaggerSchema
      mapSchema.properties[propKey] = {
        type: colIsNumber ? 'number' : 'string',
        description: rawCol.Comment,
      }
    }
    if (schema.outputFile) {
      fs.writeFileSync(schema.outputFile, JSON.stringify(definition, null, 2))
    }
    return definition
  }
}
