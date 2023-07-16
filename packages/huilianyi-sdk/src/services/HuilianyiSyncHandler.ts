import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder, SQLSearcher } from 'fc-sql'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HLY_TravelStatus } from '../core/HLY_TravelStatus'
import { TimeUtils } from '../core/TimeUtils'
import {
  App_TravelFlightTicketInfo,
  App_TravelHotelCoreInfo,
  App_TravelOrderHotel,
  App_TravelTrainTicketInfo,
} from '../core/App_CoreModels'

export class HuilianyiSyncHandler {
  syncCore: HuilianyiSyncCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
  }

  private async getLastTime(
    tableClass: { new (): FeedBase } & typeof FeedBase,
    customHandler?: (searcher: SQLSearcher) => void
  ) {
    const progressDBSpec = new tableClass().dbSpec()
    const searcher = progressDBSpec.database.searcher()
    searcher.setTable(progressDBSpec.table)
    searcher.setColumns(['MAX(last_modified_date) AS last_time'])
    if (customHandler) {
      customHandler(searcher)
    }
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

  public async dumpDepartmentRecords() {
    const syncCore = this.syncCore
    const HLY_Department = syncCore.modelsCore.HLY_Department

    const items = await syncCore.basicDataProxy.getAllDepartments()
    console.info(`[dumpDepartmentRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Department().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    for (const item of items) {
      const feed = new HLY_Department()
      feed.departmentOid = item.departmentOID
      feed.departmentName = item.departmentName
      feed.departmentPath = item.departmentPath
      feed.managerOid = item.managerOID
      feed.managerName = item.managerName
      feed.departmentParentOid = item.departmentParentOID
      feed.departmentStatus = item.status
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
        lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
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
        lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
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
      dbSpec
        .insertableCols()
        .filter(
          (col) =>
            ![
              'has_subsidy',
              'match_closed_loop',
              'is_pretty',
              'itinerary_items_str',
              'employee_traffic_items_str',
              'expense_form_codes_str',
              'ticket_data_str',
              'reload_time',
            ].includes(col)
        )
    )
    bulkAdder.declareTimestampKey('start_time')
    bulkAdder.declareTimestampKey('end_time')
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
      const itineraryItems = HuilianyiFormatter.transferItineraryHeadDTOs(
        travelInfo.travelApplication?.itineraryHeadDTOs
      )
      item.fc_edit()
      item.hasSubsidy = itineraryItems.find((item) => item.subsidyList.length > 0) ? 1 : 0
      item.itineraryItemsStr = JSON.stringify(itineraryItems)
      item.expenseFormCodesStr = (travelInfo.referenceExpenseReports || []).map((item) => item.businessCode).join(',')
      item.reloadTime = item.lastModifiedDate
      await item.updateToDB()
    }
  }

  public async dumpInvoiceRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_Invoice = syncCore.modelsCore.HLY_Invoice

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_Invoice)
      if (lastTime) {
        lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
      }
    }

    const items = await syncCore.dataProxy.getInvoiceList({
      startDate: lastModifyStartDate,
    })
    console.info(`[dumpInvoiceRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_Invoice().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('last_modified_date')
    bulkAdder.declareTimestampKey('reload_time')
    for (const item of items) {
      const feed = new HLY_Invoice()
      feed.invoiceOid = item.invoiceOID
      feed.invoiceStatus = item.invoiceStatus
      feed.expenseTypeCode = item.expenseTypeCode
      feed.expenseTypeName = item.expenseTypeName
      feed.reimbursementOid = item.reimbursementUserOID
      feed.reimbursementName = item.reimbursementUserName
      feed.amount = item.amount
      feed.createdDate = item.createdDate
      feed.lastModifiedDate = item.lastModifiedDate
      feed.extrasInfo = JSON.stringify(item)
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }

  public async dumpOrderFlightRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderFlight

    const companyList = await syncCore.othersProxy.getCompanyList()
    for (const company of companyList) {
      let lastModifyStartDate = '2020-01-01 00:00:00'
      if (!forceReload) {
        const lastTime = await this.getLastTime(OrderClass, (searcher) => {
          searcher.addConditionKV('company_oid', company.companyOID)
        })
        if (lastTime) {
          lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
        }
      }

      const items = await syncCore.dataProxy.getFlightOrders(company.companyOID, {
        lastModifyStartDate: lastModifyStartDate,
      })
      const orderItems = items.map((item) =>
        HuilianyiFormatter.transferTravelOrder<App_TravelFlightTicketInfo>(item, company.companyOID, () => {
          return {
            usersStr: item.users,
            tickets: item.flightOrderDetails.map((detail) => HuilianyiFormatter.transferFlightInfo(detail)),
          }
        })
      )
      console.info(`[Order - ${OrderClass.name}] (${company.name}) fetch ${orderItems.length} items.`)
      const dbSpec = new OrderClass().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(dbSpec.insertableCols())
      bulkAdder.declareTimestampKey('created_date')
      bulkAdder.declareTimestampKey('last_modified_date')
      bulkAdder.declareTimestampKey('reload_time')
      for (const orderItem of orderItems) {
        const feed = OrderClass.makeFeed(orderItem)
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }
  }

  public async dumpOrderTrainRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderTrain

    const companyList = await syncCore.othersProxy.getCompanyList()
    for (const company of companyList) {
      let lastModifyStartDate = '2020-01-01 00:00:00'
      if (!forceReload) {
        const lastTime = await this.getLastTime(OrderClass, (searcher) => {
          searcher.addConditionKV('company_oid', company.companyOID)
        })
        if (lastTime) {
          lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
        }
      }

      const items = await syncCore.dataProxy.getTrainOrders(company.companyOID, {
        lastModifyStartDate: lastModifyStartDate,
      })
      const orderItems = items.map((item) =>
        HuilianyiFormatter.transferTravelOrder<App_TravelTrainTicketInfo>(item, company.companyOID, () => {
          return {
            usersStr: item.users,
            tickets: item.trainOrderDetails.map((detail) => ({
              trainOrderOID: detail.trainOrderOID,
              trainName: detail.trainName,

              startDate: detail.startDate,
              endDate: detail.endDate,

              departureCityName: detail.departureCityName,
              departureStationName: detail.departureStationName,
              arrivalCityName: detail.arrivalCityName,
              arrivalStationName: detail.arrivalStationName,

              electronicOrderNo: detail.electronicOrderNo,

              passengerName: item.users,
            })),
          }
        })
      )

      console.info(`[Order - ${OrderClass.name}] (${company.name}) fetch ${orderItems.length} items.`)
      const dbSpec = new OrderClass().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(dbSpec.insertableCols())
      bulkAdder.declareTimestampKey('created_date')
      bulkAdder.declareTimestampKey('last_modified_date')
      bulkAdder.declareTimestampKey('reload_time')
      for (const orderItem of orderItems) {
        const feed = OrderClass.makeFeed(orderItem)
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }
  }

  public async dumpOrderHotelRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderHotel

    const companyList = await syncCore.othersProxy.getCompanyList()
    for (const company of companyList) {
      let lastModifyStartDate = '2020-01-01 00:00:00'
      if (!forceReload) {
        const lastTime = await this.getLastTime(OrderClass, (searcher) => {
          searcher.addConditionKV('company_oid', company.companyOID)
        })
        if (lastTime) {
          lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
        }
      }

      const items = await syncCore.dataProxy.getHotelOrders(company.companyOID, {
        lastModifyStartDate: lastModifyStartDate,
      })
      const orderItems = items.map((item) =>
        HuilianyiFormatter.transferTravelOrder<App_TravelOrderHotel>(item, company.companyOID, () => {
          const coreInfo = item.hotelOrderDetail
          const simpleCoreInfo: App_TravelHotelCoreInfo = {
            hotelOrderOID: coreInfo.hotelOrderOID,
            hotelName: coreInfo.hotelName,

            startDate: coreInfo.startDate,
            endDate: coreInfo.endDate,

            cityName: coreInfo.cityName,
            roomName: coreInfo.roomName,
            roomCount: coreInfo.roomCount,
            roomDays: coreInfo.roomDays,

            clientInfo: coreInfo.clientInfo,
            roomInfo: coreInfo.roomInfo,
          }
          return {
            usersStr: item.users,
            tickets: [simpleCoreInfo] as any,
          }
        })
      )

      console.info(`[Order - ${OrderClass.name}] (${company.name}) fetch ${orderItems.length} items.`)
      const dbSpec = new OrderClass().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(dbSpec.insertableCols())
      bulkAdder.declareTimestampKey('created_date')
      bulkAdder.declareTimestampKey('last_modified_date')
      bulkAdder.declareTimestampKey('reload_time')
      for (const orderItem of orderItems) {
        const feed = OrderClass.makeFeed(orderItem)
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }
  }
}
