import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { SafeTask } from '@fangcha/tools'
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
    tableName: 'oss_resource',
    generator: generalDataGenerator,
    outputFile: `${__dirname}/../src/main/models/auto-build/__OSSResource.ts`,
    extFile: `${__dirname}/../src/main/models/extensions/_OSSResource.ts`,
    primaryKey: 'resource_id',
    modifiableBlackList: ['provider', 'bucket_name', 'oss_key', 'create_time'],
  },
  {
    tableName: 'resource_task',
    generator: generalDataGenerator,
    outputFile: `${__dirname}/../src/main/models/auto-build/__ResourceTask.ts`,
    extFile: `${__dirname}/../src/main/models/extensions/_ResourceTask.ts`,
    primaryKey: 'task_key',
  },
  {
    tableName: 'user_resource_task',
    generator: generalDataGenerator,
    outputFile: `${__dirname}/../src/main/models/auto-build/__UserResourceTask.ts`,
    extFile: `${__dirname}/../src/main/models/extensions/_UserResourceTask.ts`,
    primaryKey: ['task_key', 'user_email'],
  },
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const generator = schema.generator!
    const data = await generator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }
})
