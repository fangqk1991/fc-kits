import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder, SQLSearcher } from 'fc-sql'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HLY_TravelStatus } from '../core/travel/HLY_TravelStatus'
import { TimeUtils } from '../core/tools/TimeUtils'
import {
  App_TrafficTicket,
  App_TravelFlightTicketInfo,
  App_TravelHotelCoreInfo,
  App_TravelOrderHotel,
  App_TravelTrainTicketInfo,
} from '../core/travel/App_TravelModels'
import { HLY_StaffRole } from '../core/staff/HLY_StaffRole'
import { _HLY_StaffGroup } from '../models/extensions/_HLY_StaffGroup'

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

  public async dumpStaffGroupRecords() {
    const syncCore = this.syncCore
    const HLY_StaffGroup = syncCore.modelsCore.HLY_StaffGroup

    const items = await syncCore.basicDataProxy.getUserGroupList()
    console.info(`[dumpStaffGroupRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_StaffGroup().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    for (const item of items) {
      const feed = new HLY_StaffGroup()
      feed.groupOid = item.userGroupOID
      feed.groupCode = item.code
      feed.groupName = item.name
      feed.isEnabled = item.enabled ? 1 : 0
      feed.extrasInfo = JSON.stringify(item)
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()

    const HLY_StaffGroupMember = syncCore.modelsCore.HLY_StaffGroupMember

    for (const group of items) {
      const dbSpec = new HLY_StaffGroupMember().dbSpec()
      const newMembers = await syncCore.basicDataProxy.getUserGroupMembers(group.code)

      const runner = dbSpec.database.createTransactionRunner()
      await runner.commit(async (transaction) => {
        const bulkAdder = new SQLBulkAdder(dbSpec.database)
        bulkAdder.transaction = transaction
        bulkAdder.setTable(dbSpec.table)
        bulkAdder.useUpdateWhenDuplicate()
        bulkAdder.setInsertKeys(dbSpec.insertableCols())
        const userOidList = newMembers.map((item) => item.userOID)
        for (const userOid of userOidList) {
          const feed = new HLY_StaffGroupMember()
          feed.groupOid = group.userGroupOID
          feed.userOid = userOid
          bulkAdder.putObject(feed.fc_encode())
        }
        await bulkAdder.execute()

        const searcher = new HLY_StaffGroupMember().fc_searcher()
        searcher.processor().transaction = transaction
        searcher.processor().addConditionKV('group_oid', group.userGroupOID)
        searcher.processor().addConditionKeyNotInArray('user_oid', userOidList)
        const toRemoveItems = await searcher.queryAllFeeds()

        for (const member of toRemoveItems) {
          await member.deleteFromDB(transaction)
        }
      })
    }
  }

  public async dumpStaffRecords() {
    const syncCore = this.syncCore
    const HLY_Staff = syncCore.modelsCore.HLY_Staff
    const HLY_StaffGroup = syncCore.modelsCore.HLY_StaffGroup
    const HLY_StaffGroupMember = syncCore.modelsCore.HLY_StaffGroupMember

    const items = await syncCore.basicDataProxy.getAllStaffs()
    console.info(`[dumpStaffRecords] fetch ${items.length} items.`)

    const groupMapper = await HLY_StaffGroup.wholeGroupMapper()
    const groupMembers = await new HLY_StaffGroupMember().fc_searcher().queryAllFeeds()
    const userGroupsMapper: { [p: string]: _HLY_StaffGroup[] } = {}
    for (const member of groupMembers) {
      if (!userGroupsMapper[member.userOid]) {
        userGroupsMapper[member.userOid] = []
      }
      const group = groupMapper[member.groupOid]
      if (group) {
        userGroupsMapper[member.userOid].push(group)
      }
    }

    const dbSpec = new HLY_Staff().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('entry_date')
    bulkAdder.declareTimestampKey('leaving_date')
    for (const item of items) {
      const groupList = userGroupsMapper[item.userOID] || []
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
      feed.groupOidsStr = groupList.map((item) => item.groupOid).join(',')
      feed.groupCodesStr = groupList.map((item) => item.groupCode).join(',')
      feed.groupNamesStr = groupList.map((item) => item.groupName).join(',')
      feed.staffRole = groupList.find((item) => item.groupName === '管理层')
        ? HLY_StaffRole.Manager
        : HLY_StaffRole.Normal
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

  public async dumpPublicPaymentRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_PublicPayment = syncCore.modelsCore.HLY_PublicPayment

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_PublicPayment)
      if (lastTime) {
        lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
      }
    }

    const items = await syncCore.dataProxy.getPublicPaymentList({
      lastModifyStartDate: lastModifyStartDate,
    })
    console.info(`[dumpPublicPaymentRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_PublicPayment().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('last_modified_date')
    bulkAdder.declareTimestampKey('reload_time')
    for (const item of items) {
      const feed = HLY_PublicPayment.makeFeed(HuilianyiFormatter.transferExpenseModel(item))
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
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()

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
        HuilianyiFormatter.transferTravelOrder<App_TravelFlightTicketInfo>(
          item,
          company.companyOID,
          employeeIdToUserOidMapper,
          nameToUserOidsMapper,
          () => {
            const tickets = item.flightOrderDetails.map((detail) => HuilianyiFormatter.transferFlightInfo(detail))
            const commonTickets = tickets.map((ticket) => ({
              tagName: '机票',
              orderOid: ticket.flightOrderOID,
              trafficCode: ticket.flightCode,
              fromTime: ticket.startDate,
              toTime: ticket.endDate,
              fromCity: ticket.startCity,
              toCity: ticket.endCity,
              employeeId: ticket.employeeId,
              employeeName: ticket.employeeName,
            }))
            let [startTime, endTime] = ['', '']
            if (commonTickets.length > 0) {
              startTime = TimeUtils.momentUTC8(commonTickets[0].fromTime).format()
              endTime = TimeUtils.momentUTC8(commonTickets[commonTickets.length - 1].toTime).format()
            }
            return {
              userNamesStr: item.users,
              tickets: tickets,
              commonTickets: commonTickets,
              startTime: startTime || null,
              endTime: endTime || null,
            }
          }
        )
      )
      console.info(`[Order - ${OrderClass.name}] (${company.name}) fetch ${orderItems.length} items.`)
      const dbSpec = new OrderClass().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(dbSpec.insertableCols().filter((item) => !['business_code'].includes(item)))
      bulkAdder.declareTimestampKey('created_date')
      bulkAdder.declareTimestampKey('last_modified_date')
      bulkAdder.declareTimestampKey('reload_time')
      bulkAdder.declareTimestampKey('start_time')
      bulkAdder.declareTimestampKey('end_time')
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
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()

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
      const orderItems = items.map((item) => {
        return HuilianyiFormatter.transferTravelOrder<App_TravelTrainTicketInfo>(
          item,
          company.companyOID,
          employeeIdToUserOidMapper,
          nameToUserOidsMapper,
          () => {
            const tickets = item.trainOrderDetails.map((detail) => ({
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
            }))
            const commonTickets: App_TrafficTicket[] = []
            for (const ticket of tickets) {
              const nameList = (ticket.passengerName || '')
                .split(',')
                .map((item) => item.trim())
                .filter((item) => !!item)
              for (const passengerName of nameList) {
                commonTickets.push({
                  tagName: '火车票',
                  orderOid: ticket.trainOrderOID,
                  trafficCode: ticket.trainName,
                  fromTime: ticket.startDate,
                  toTime: ticket.endDate,
                  fromCity: ticket.departureCityName,
                  toCity: ticket.arrivalCityName,
                  employeeId: '',
                  employeeName: passengerName,
                })
              }
            }
            let [startTime, endTime] = ['', '']
            if (commonTickets.length > 0) {
              startTime = TimeUtils.momentUTC8(commonTickets[0].fromTime).format()
              endTime = TimeUtils.momentUTC8(commonTickets[commonTickets.length - 1].toTime).format()
            }
            return {
              userNamesStr: item.users,
              tickets: tickets,
              commonTickets: commonTickets,
              startTime: startTime || null,
              endTime: endTime || null,
            }
          }
        )
      })

      console.info(`[Order - ${OrderClass.name}] (${company.name}) fetch ${orderItems.length} items.`)
      const dbSpec = new OrderClass().dbSpec()
      const bulkAdder = new SQLBulkAdder(dbSpec.database)
      bulkAdder.setTable(dbSpec.table)
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(dbSpec.insertableCols().filter((item) => !['business_code'].includes(item)))
      bulkAdder.declareTimestampKey('created_date')
      bulkAdder.declareTimestampKey('last_modified_date')
      bulkAdder.declareTimestampKey('reload_time')
      bulkAdder.declareTimestampKey('start_time')
      bulkAdder.declareTimestampKey('end_time')
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
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()

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
        HuilianyiFormatter.transferTravelOrder<App_TravelOrderHotel>(
          item,
          company.companyOID,
          employeeIdToUserOidMapper,
          nameToUserOidsMapper,
          () => {
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
              userNamesStr: item.users,
              tickets: [simpleCoreInfo] as any,
              commonTickets: [],
              startTime: null,
              endTime: null,
            }
          }
        )
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
      bulkAdder.declareTimestampKey('start_time')
      bulkAdder.declareTimestampKey('end_time')
      for (const orderItem of orderItems) {
        const feed = OrderClass.makeFeed(orderItem)
        bulkAdder.putObject(feed.fc_encode())
      }
      await bulkAdder.execute()
    }
  }

  public async dumpExpenseApplicationRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_ExpenseApplication = syncCore.modelsCore.HLY_ExpenseApplication

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_ExpenseApplication)
      if (lastTime) {
        lastModifyStartDate = TimeUtils.timeStrUTC8(lastTime)
      }
    }

    const items = await syncCore.dataProxy.getExpenseApplicationList({
      lastModifyStartDate: lastModifyStartDate,
    })
    console.info(`[dumpExpenseApplicationRecords] fetch ${items.length} items.`)

    const dbSpec = new HLY_ExpenseApplication().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(dbSpec.insertableCols())
    bulkAdder.declareTimestampKey('created_date')
    bulkAdder.declareTimestampKey('last_modified_date')
    bulkAdder.declareTimestampKey('reload_time')
    for (const item of items) {
      const feed = HLY_ExpenseApplication.makeFeed(HuilianyiFormatter.transferExpenseApplicationModel(item) as any)
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }
}
