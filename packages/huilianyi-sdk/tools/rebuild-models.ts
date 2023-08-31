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
    gbkCols: ['participant_user_names_str'],
    exactSearchCols: ['business_code'],
    fuzzySearchCols: ['applicant_name'],
  },
  {
    tableName: 'hly_travel_participant',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_TravelParticipant.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_TravelParticipant.ts`,
    primaryKey: ['business_code', 'user_oid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_expense_application',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_ExpenseApplication.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_ExpenseApplication.ts`,
    primaryKey: ['hly_id'],
    forceInsertableWhiteList: ['created_date', 'last_modified_date'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_staff',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_Staff.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_Staff.ts`,
    primaryKey: ['user_oid'],
    gbkCols: ['full_name', 'base_city'],
    modifiableBlackList: ['create_time', 'update_time'],
    exactSearchCols: ['user_oid', 'employee_id'],
    fuzzySearchCols: ['full_name', 'email'],
  },
  {
    tableName: 'hly_staff_group',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_StaffGroup.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_StaffGroup.ts`,
    primaryKey: ['group_oid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_staff_group_member',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_StaffGroupMember.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_StaffGroupMember.ts`,
    primaryKey: ['group_oid', 'user_oid'],
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
    tableName: 'hly_allowance_rule',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_AllowanceRule.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_AllowanceRule.ts`,
    primaryKey: ['uid'],
    modifiableBlackList: ['create_time', 'update_time'],
  },
  {
    tableName: 'hly_travel_allowance',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_TravelAllowance.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_TravelAllowance.ts`,
    primaryKey: ['uid'],
    insertableBlackList: ['use_custom', 'custom_data_str'],
    modifiableBlackList: ['create_time', 'update_time'],
    exactSearchCols: ['business_code'],
    fuzzySearchCols: ['applicant_name', 'company_name'],
    gbkCols: ['applicant_name', 'company_name'],
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
    exactSearchCols: ['hly_id', 'business_code'],
    fuzzySearchCols: ['applicant_name'],
  },
  {
    tableName: 'hly_traffic_ticket',
    outputFile: `${__dirname}/../src/models/auto-build/__HLY_TrafficTicket.ts`,
    extFile: `${__dirname}/../src/models/extensions/_HLY_TrafficTicket.ts`,
    primaryKey: ['ticket_id'],
    modifiableBlackList: ['create_time', 'update_time'],
    gbkCols: ['user_name'],
    exactSearchCols: [
      'ticket_id',
      'order_id',
      'order_oid',
      'journey_no',
      'business_code',
      'from_city',
      'to_city',
      'traffic_code',
    ],
    fuzzySearchCols: ['user_name'],
  },
  {
    tableName: 'ctrip_order',
    outputFile: `${__dirname}/../src/models/auto-build/__CTrip_Order.ts`,
    extFile: `${__dirname}/../src/models/extensions/_CTrip_Order.ts`,
    primaryKey: ['order_id'],
    modifiableBlackList: ['create_time', 'update_time'],
    gbkCols: ['user_name'],
    exactSearchCols: ['order_id', 'journey_no'],
    fuzzySearchCols: ['user_name'],
  },
  {
    tableName: 'dummy_travel',
    outputFile: `${__dirname}/../src/models/auto-build/__Dummy_Travel.ts`,
    extFile: `${__dirname}/../src/models/extensions/_Dummy_Travel.ts`,
    primaryKey: ['hly_id'],
    forceModifiableWhiteList: ['business_code'],
    modifiableBlackList: ['create_time', 'update_time'],
    gbkCols: ['applicant_name'],
    exactSearchCols: ['hly_id', 'business_code'],
    fuzzySearchCols: ['applicant_name'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
  },
  {
    tableName: 'dummy_ticket',
    outputFile: `${__dirname}/../src/models/auto-build/__Dummy_Ticket.ts`,
    extFile: `${__dirname}/../src/models/extensions/_Dummy_Ticket.ts`,
    primaryKey: ['ticket_id'],
    modifiableBlackList: ['create_time', 'update_time'],
    gbkCols: ['user_name'],
    exactSearchCols: ['order_id', 'ticket_id', 'business_code'],
    fuzzySearchCols: ['user_name'],
    reloadOnAdded: true,
    reloadOnUpdated: true,
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
