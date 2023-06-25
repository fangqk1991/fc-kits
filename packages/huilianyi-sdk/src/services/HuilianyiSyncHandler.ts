import * as moment from 'moment'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder } from 'fc-sql'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HLY_TravelStatus } from '../core/HLY_TravelStatus'

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

  public async dumpStaffRecords() {
    const syncCore = this.syncCore
    const HLY_Staff = syncCore.modelsCore.HLY_Staff

    const items = await syncCore.basicDataProxy.getAllStaffs()
    console.info(`[dumpStaffRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Staff().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('entry_date')
    bulkAdder.declareTimestampKey('leaving_date')
    for (const item of items) {
      const feed = new HLY_Staff()
      feed.userOid = item.userOID
      feed.companyCode = item.companyCode
      feed.fullName = item.fullName
      feed.departmentOid = item.departmentOID
      feed.departmentPath = item.departmentPath
      feed.employeeId = item.employeeID
      feed.email = item.email
      feed.staffStatus = item.status
      feed.entryDate = item.entryDate
      feed.leavingDate = item.leavingDate
      feed.extrasInfo = JSON.stringify(item)
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }

  public async dumpExpenseRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_Expense = syncCore.modelsCore.HLY_Expense

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_Expense)
      if (lastTime) {
        lastModifyStartDate = moment(lastTime).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')
      }
    }

    const items = await syncCore.dataProxy.getExpenseReportListV2({
      lastModifyStartDate: lastModifyStartDate,
    })
    console.info(`[dumpExpenseRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Expense().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('last_modified_date')
    bulkAdder.declareTimestampKey('reload_time')
    for (const item of items) {
      const feed = HLY_Expense.makeFeed(HuilianyiFormatter.transferExpenseModel(item))
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }

  public async dumpTravelRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_Travel = syncCore.modelsCore.HLY_Travel

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_Travel)
      if (lastTime) {
        lastModifyStartDate = moment(lastTime).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')
      }
    }

    const items = await syncCore.dataProxy.getTravelApplicationList({
      startDate: lastModifyStartDate,
    })
    console.info(`[dumpTravelRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Travel().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((col) => !['itinerary_items_str', 'reload_time'].includes(col))
    )
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('last_modified_date')
    for (const item of items) {
      const feed = HLY_Travel.makeFeed(HuilianyiFormatter.transferTravelModel(item))
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()

    const searcher = new HLY_Travel().fc_searcher()
    if (!forceReload) {
      searcher.processor().addSpecialCondition('last_modified_date != reload_time')
    }
    searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
    const todoItems = await searcher.queryAllFeeds()

    console.info(`[dumpTravelRecords] ${todoItems.length} items need to reload.`)
    for (const item of todoItems) {
      const travelInfo = await syncCore.dataProxy.getTravelApplicationDetail(item.businessCode)
      item.fc_edit()
      item.itineraryItemsStr = JSON.stringify(
        HuilianyiFormatter.transferItineraryHeadDTOs(travelInfo.travelApplication?.itineraryHeadDTOs)
      )
      item.reloadTime = item.lastModifiedDate
      await item.updateToDB()
    }
  }
}
