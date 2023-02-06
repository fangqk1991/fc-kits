import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { EventDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const eventGenerator = new ModelGenerator({
  dbConfig: EventDBOptions,
  tmplFile: modelTmpl,
  extTmplFile: extendTmpl,
})

const generalDataSchemas: DBModelSchema[] = [
  {
    tableName: 'stat_event',
    outputFile: `${__dirname}/../src/models/auto-build/__StatEvent.ts`,
    extFile: `${__dirname}/../src/models/extensions/_StatEvent.ts`,
  },
  {
    tableName: 'event_log',
    outputFile: `${__dirname}/../src/models/auto-build/__EventLog.ts`,
    extFile: `${__dirname}/../src/models/extensions/_EventLog.ts`,
  },
]

const main = async () => {
  for (const schema of generalDataSchemas) {
    const data = await eventGenerator.generateData(schema)
    eventGenerator.buildModel(schema, data)
  }
  process.exit()
}
main()
