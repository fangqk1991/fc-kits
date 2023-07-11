import { DBModelSchema, ModelGenerator } from '@fangcha/generator'
import { DemoDBOptions } from './db-config'

const modelTmpl = `${__dirname}/model.tmpl.ejs`
const extendTmpl = `${__dirname}/class.extends.model.ejs`

const dbGenerator = new ModelGenerator({
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
    forceInsertableWhiteList: ['created_date', 'first_submitted_date', 'last_submitted_date', 'last_modified_date'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_travel',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Travel.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Travel.ts`,
    primaryKey: ['hly_id'],
    forceInsertableWhiteList: ['created_date', 'last_modified_date'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_staff',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Staff.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Staff.ts`,
    primaryKey: ['user_oid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_department',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Department.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Department.ts`,
    primaryKey: ['department_oid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_invoice',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Invoice.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Invoice.ts`,
    primaryKey: ['invoice_oid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_config',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Config.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Config.ts`,
    primaryKey: ['config_key'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_travel_allowance',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_TravelAllowance.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_TravelAllowance.ts`,
    primaryKey: ['uid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_snapshot_log',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_SnapshotLog.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_SnapshotLog.ts`,
    primaryKey: ['target_month'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_order_flight',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_OrderBase.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_OrderBase.ts`,
    primaryKey: ['hly_id'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
]

const main = async () => {
  for (const schema of dbSchemas) {
    const data = await dbGenerator.generateData(schema)
    dbGenerator.buildModel(schema, data)
  }
  process.exit()
}
main()
