import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { GeneralDataDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const generalDataGenerator = new ModelGenerator({
  dbConfig: GeneralDataDBOptions,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    tableName: 'common_job',
    outputFile: `${__dirname}/../src/main/models/auto-build/__CommonJob.ts`,
    extFile: `${__dirname}/../src/main/models/extensions/_CommonJob.ts`,
    primaryKey: ['job_id'],
    modifiableBlackList: ['app', 'queue', 'task_name', 'params_str', 'create_time'],
  },
]

const main = async () => {
  for (const schema of generalDataSchemas) {
    const data = await generalDataGenerator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }
  process.exit()
}
main()
