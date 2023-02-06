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
    tableName: 'common_group',
    outputFile: `${__dirname}/../src/models/auto-build/__CommonGroup.ts`,
    extFile: `${__dirname}/../src/models/extensions/_CommonGroup.ts`,
    primaryKey: 'group_id',
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['create_time'],
  },
  {
    tableName: 'group_member',
    outputFile: `${__dirname}/../src/models/auto-build/__CommonMember.ts`,
    extFile: `${__dirname}/../src/models/extensions/_CommonMember.ts`,
    primaryKey: ['group_id', 'member'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['create_time'],
  },
  {
    tableName: 'group_permission',
    outputFile: `${__dirname}/../src/models/auto-build/__CommonPermission.ts`,
    extFile: `${__dirname}/../src/models/extensions/_CommonPermission.ts`,
    primaryKey: ['group_id', 'scope', 'permission'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
    modifiableBlackList: ['group_id', 'scope', 'permission', 'create_time'],
  },
]

SafeTask.run(async () => {
  for (const schema of generalDataSchemas) {
    const data = await generalDataGenerator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }
})
