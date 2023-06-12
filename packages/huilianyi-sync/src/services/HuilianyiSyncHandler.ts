import * as moment from 'moment'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder } from 'fc-sql'

export class HuilianyiSyncHandler {
  syncCore: HuilianyiSyncCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
  }

  private async getLastTime(tableClass: { new (): FeedBase } & typeof FeedBase) {
    const progressDBSpec = new tableClass().dbSpec()
    const searcher = progressDBSpec.database.searcher()
    searcher.setTable(progressDBSpec.table)
    searcher.setColumns(['MAX(last_modified_date) AS last_time'])
    const result = (await searcher.querySingle()) as any
    return result['last_time']
  }

  public async dumpExpenseRecords() {
    const syncCore = this.syncCore
    const HLY_Expense = syncCore.HLY_Expense

    const lastTime = await this.getLastTime(HLY_Expense)

    const items = await syncCore.dataProxy.getExpenseReportListV2({
      lastModifyStartDate: lastTime
        ? moment(lastTime).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')
        : '2020-01-01 00:00:00',
    })
    console.info(`[dumpExpenseRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Expense().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('first_submitted_date')
    bulkAdder.declareTimestampKey('last_submitted_date')
    bulkAdder.declareTimestampKey('last_modified_date')

    for (const item of items) {
      const feed = new HLY_Expense()
      feed.hlyId = Number(item.id)
      feed.businessCode = item.businessCode
      feed.applicationOid = item.applicationOID
      feed.applicantOid = item.applicantOID
      feed.applicantName = item.applicantName
      feed.companyOid = item.companyOID
      feed.departmentOid = item.departmentOID
      feed.corporationOid = item.corporationOID
      feed.formOid = item.formOID
      feed.formName = item.formName
      feed.submittedBy = item.submittedBy
      feed.title = item.title
      feed.expenseType = item.type
      feed.expenseStatus = item.status
      feed.totalAmount = item.totalAmount
      feed.createdDate = moment(item.createdDate).format()
      feed.firstSubmittedDate = moment(item.firstSubmittedDate).format()
      feed.lastSubmittedDate = moment(item.lastSubmittedDate).format()
      feed.lastModifiedDate = moment(item.lastModifiedDate).format()
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }
}
