import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import * as fs from 'fs'
import { GeneralDataDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tiny.tmpl.ejs`

const generalDataGenerator = new ModelGenerator({
  dbConfig: GeneralDataDBOptions,
  tmplFile: modelTmpl,
})

const rootDir = `${__dirname}/../src/common/models/auto-build`

const generalDataSchemas: DBModelSchema[] = [
  {
    tableName: 'common_group',
    outputFile: `${rootDir}/CommonGroupModel.ts`,
  },
  {
    tableName: 'group_member',
    outputFile: `${rootDir}/CommonMemberModel.ts`,
  },
  {
    tableName: 'group_permission',
    outputFile: `${rootDir}/CommonPermissionModel.ts`,
  },
]

const main = async () => {
  for (const schema of generalDataSchemas) {
    const data = await generalDataGenerator.generateData(schema)
    generalDataGenerator.buildModel(schema, data)
  }

  const lines = [...generalDataSchemas].map((item) => {
    const className = (item.outputFile.split('/').pop() as string).split('.')[0]
    return `export * from './${className}'`
  })
  fs.writeFileSync(`${rootDir}/index.ts`, lines.join('\n') + '\n')

  process.exit()
}
main()
