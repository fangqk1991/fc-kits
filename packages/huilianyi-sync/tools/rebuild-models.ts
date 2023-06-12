import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { DemoDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const dbGenetator = new ModelGenerator({
  dbConfig: DemoDBOptions,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const dbSchemas: DBModelSchema[] = [
  {
    tableName: 'hly_expense',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Expense.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Expense.ts`,
    primaryKey: ['hly_id'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
]

const main = async () => {
  for (const schema of dbSchemas) {
    const data = await dbGenetator.generateData(schema)
    dbGenetator.buildModel(schema, data)
  }
  process.exit()
}
main()
