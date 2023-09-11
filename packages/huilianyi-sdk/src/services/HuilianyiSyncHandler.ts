import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder, SQLSearcher, Transaction } from 'fc-sql'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import {
  App_TrafficTicket,
  App_TravelFlightTicketInfo,
  App_TravelHotelCoreInfo,
  App_TravelOrderHotel,
  App_TravelTrainTicketInfo,
  HLY_Company,
  HLY_OrderType,
  HLY_StaffRole,
  HLY_TravelParticipant,
  HLY_TravelStatus,
  TimeUtils,
} from '../core'
import { _HLY_StaffGroup } from '../models/extensions/_HLY_StaffGroup'
import { md5 } from '@fangcha/tools'
import { _Dummy_Travel } from '../models/extensions/_Dummy_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'
import { CTrip_FlightChangeInfoEntity, CTrip_FlightChangeType } from '@fangcha/ctrip-sdk'

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
    bulkAdder.setInsertKeys(dbSpec.insertableCols().filter((item) => !['base_city', 'without_allowance'].includes(item)))
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

  public async do_syncDummyTravelRecords(
    dummyItems: _Dummy_Travel[],
    staffMapper: { [p: string]: _HLY_Staff },
    companyMapper: { [p: string]: HLY_Company },
    transaction?: Transaction
  ) {
    const syncCore = this.syncCore
    const HLY_Travel = syncCore.modelsCore.HLY_Travel

    const dbSpec = new HLY_Travel().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    if (transaction) {
      bulkAdder.transaction = transaction
    }
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys([
      'hly_id',
      'business_code',
      'applicant_oid',
      'applicant_name',
      'company_oid',
      'department_oid',
      'form_code',
      'form_name',
      'version',
      'created_date',
      'last_modified_date',
      'start_time',
      'end_time',
      'travel_status',
      'submitted_by',
      'is_dummy',
      'extras_info',
    ])
    bulkAdder.declareTimestampKey('created_date', 'last_modified_date')

    for (const item of dummyItems) {
      const participants: HLY_TravelParticipant[] = [
        {
          userOID: item.applicantOid,
          participantOID: item.applicantOid,
          fullName: item.applicantName,
          avatar: '',
        },
      ]

      const staff = staffMapper[item.applicantOid]

      const feed = new HLY_Travel()
      feed.hlyId = item.hlyId
      feed.businessCode = item.businessCode
      feed.applicantOid = item.applicantOid
      feed.applicantName = item.applicantName
      if (staff) {
        const company = companyMapper[staff.companyCode!]
        if (company) {
          feed.companyOid = company.companyOID
        }
        feed.departmentOid = staff.departmentOid
      }
      feed.formCode = 'DUMMY_TRAVEL'
      feed.formName = '虚拟申请单'
      feed.version = item.version
      feed.createdDate = item.createTime
      feed.lastModifiedDate = item.updateTime
      feed.travelStatus = item.travelStatus
      feed.startTime = item.startTime
      feed.endTime = item.endTime
      feed.submittedBy = item.submittedBy
      feed.isDummy = 1
      feed.participantUserOidsStr = participants.map((item) => item.userOID).join(',')
      feed.participantUserNamesStr = participants.map((item) => item.fullName).join(',')
      feed.extrasInfo = JSON.stringify({
        participants: participants,
        customProps: {},
      })
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()
  }

  public async syncDummyTravelRecords() {
    const syncCore = this.syncCore
    const Dummy_Travel = syncCore.modelsCore.Dummy_Travel
    const dummyItems = await new Dummy_Travel().fc_searcher().queryAllFeeds()
    const staffMapper = await syncCore.modelsCore.HLY_Staff.staffMapper()
    const companyMapper = await syncCore.othersProxy.getCompanyMapper()
    await this.do_syncDummyTravelRecords(dummyItems, staffMapper, companyMapper)
  }

  public async dumpTravelRecords(forceReload = false) {
    const syncCore = this.syncCore
    const HLY_Travel = syncCore.modelsCore.HLY_Travel

    let lastModifyStartDate = '2020-01-01 00:00:00'
    if (!forceReload) {
      const lastTime = await this.getLastTime(HLY_Travel, (searcher) => {
        searcher.addConditionKV('is_dummy', 0)
      })
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
    bulkAdder.setInsertKeys(['hly_id', 'business_code', 'created_date', 'last_modified_date', 'travel_status'])
    bulkAdder.declareTimestampKey('created_date', 'last_modified_date')

    for (const item of items) {
      const feed = new HLY_Travel()
      feed.hlyId = Number(item.applicationId)
      feed.businessCode = item.businessCode
      feed.createdDate = item.createdDate
      feed.lastModifiedDate = item.lastModifiedDate
      feed.travelStatus = item.status
      bulkAdder.putObject(feed.fc_encode())
    }
    await bulkAdder.execute()

    const searcher = new HLY_Travel().fc_searcher()
    if (!forceReload) {
      searcher.processor().addSpecialCondition('last_modified_date != reload_time')
    }
    searcher.processor().addConditionKV('is_dummy', 0)
    searcher.processor().addSpecialCondition('travel_status != ?', HLY_TravelStatus.Deleted)
    const todoItems = await searcher.queryAllFeeds()

    console.info(`[dumpTravelRecords] ${todoItems.length} items need to reload.`)
    for (const item of todoItems) {
      const travelInfo = await syncCore.dataProxy.getTravelApplicationDetail(item.businessCode)
      const props = HuilianyiFormatter.transferTravelModel(travelInfo)
      delete (props as any).hasRepeated
      delete (props as any).isNewest
      delete (props as any).overlappedCodes
      delete (props as any).isIgnored
      delete (props as any).matchClosedLoop
      delete (props as any).isPretty
      delete (props as any).ticketIdListStr
      delete (props as any).employeeTrafficItemsStr
      await item.updateInfos(props)
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

  public async getFlightChangeInfoMapper() {
    const searcher = new this.syncCore.modelsCore.CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', 'FLIGHT')
    searcher.processor().addConditionKV('order_status', '航班变更')
    const items = await searcher.queryAllFeeds()
    const mapper: { [orderId: string]: CTrip_FlightChangeInfoEntity } = {}
    for (const item of items) {
      const info = item.flightChangeInfo()
      if (info) {
        mapper[item.orderId] = info
      }
    }
    return mapper
  }

  public async dumpOrderFlightRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderFlight
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await syncCore.modelsCore.HLY_Staff.staffMapper()

    const changeInfoMapper = await this.getFlightChangeInfoMapper()
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
          (orderItem) => {
            const tickets = item.flightOrderDetails.map((detail) => HuilianyiFormatter.transferFlightInfo(detail))
            const commonTickets = tickets.map((ticket) => {
              let userOid = employeeIdToUserOidMapper[ticket.employeeId] || ''
              if (!userOid && item.applicant === ticket.employeeName) {
                userOid = employeeIdToUserOidMapper[item.employeeId] || ''
              }
              if (
                !userOid &&
                nameToUserOidsMapper[ticket.employeeName] &&
                nameToUserOidsMapper[ticket.employeeName].length === 1
              ) {
                userOid = nameToUserOidsMapper[ticket.employeeName][0]
              }
              const baseCity = userOid && staffMapper[userOid] ? staffMapper[userOid].baseCity : ''
              const data: App_TrafficTicket = {
                ticketId: '',
                orderType: HLY_OrderType.FLIGHT,
                orderId: Number(item.orderId),
                orderOid: ticket.flightOrderOID,
                trafficCode: ticket.flightCode,
                fromTime: ticket.startDate,
                toTime: ticket.endDate,
                fromCity: ticket.startCity,
                toCity: ticket.endCity,
                userOid: userOid,
                employeeId: ticket.employeeId,
                userName: ticket.employeeName,
                baseCity: baseCity,
                journeyNo: orderItem.journeyNo,
                businessCode: orderItem.businessCode || '',
                hlyCode: orderItem.businessCode || '',
                customCode: '',
                isValid: ['已成交', '航班变更'].includes(orderItem.orderStatus) ? 1 : 0,
                isDummy: 0,
              }
              data.ticketId = md5(
                [data.orderType, data.orderId, data.userOid || data.userName, data.trafficCode].join(',')
              )
              const changeInfo = changeInfoMapper[data.orderId]
              if (changeInfo) {
                data.fromTime = TimeUtils.correctUTC8Timestamp(changeInfo.ProtectDdate)
                data.toTime = TimeUtils.correctUTC8Timestamp(changeInfo.ProtectAdate)
              }
              return data
            })
            let [startTime, endTime] = ['', '']
            if (commonTickets.length > 0) {
              startTime = commonTickets[0].fromTime
              endTime = commonTickets[commonTickets.length - 1].toTime
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
      {
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
      {
        const runner = new OrderClass().dbSpec().database.createTransactionRunner()
        await runner.commit(async (transaction) => {
          for (const orderItem of orderItems.filter((item) => item.businessCode)) {
            const orderFeed = new OrderClass()
            orderFeed.hlyId = orderItem.hlyId
            orderFeed.businessCode = null as any
            orderFeed.fc_edit()
            orderFeed.businessCode = orderItem.businessCode || ''
            await orderFeed.updateToDB(transaction)
          }
        })
      }
    }
  }

  public async dumpOrderTrainRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderTrain
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await syncCore.modelsCore.HLY_Staff.staffMapper()

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
          (orderItem) => {
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
                let userOid = ''
                if (!userOid && item.applicant === passengerName) {
                  userOid = employeeIdToUserOidMapper[item.employeeId] || ''
                }
                if (
                  !userOid &&
                  nameToUserOidsMapper[passengerName] &&
                  nameToUserOidsMapper[passengerName].length === 1
                ) {
                  userOid = nameToUserOidsMapper[passengerName][0]
                }
                const baseCity = userOid && staffMapper[userOid] ? staffMapper[userOid].baseCity : ''
                const data: App_TrafficTicket = {
                  ticketId: '',
                  orderType: HLY_OrderType.TRAIN,
                  orderId: Number(item.orderId),
                  orderOid: ticket.trainOrderOID,
                  trafficCode: ticket.trainName,
                  fromTime: ticket.startDate,
                  toTime: ticket.endDate,
                  fromCity: ticket.departureCityName,
                  toCity: ticket.arrivalCityName,
                  userOid: userOid,
                  employeeId: '',
                  userName: passengerName,
                  baseCity: baseCity,
                  journeyNo: orderItem.journeyNo,
                  businessCode: orderItem.businessCode || '',
                  hlyCode: orderItem.businessCode || '',
                  customCode: '',
                  isValid: ['已购票', '待出票'].includes(orderItem.orderStatus) ? 1 : 0,
                  isDummy: 0,
                }
                data.ticketId = md5(
                  [data.orderType, data.orderId, data.userOid || data.userName, data.trafficCode].join(',')
                )
                commonTickets.push(data)
              }
            }
            let [startTime, endTime] = ['', '']
            if (commonTickets.length > 0) {
              startTime = commonTickets[0].fromTime
              endTime = commonTickets[commonTickets.length - 1].toTime
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
      {
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
      {
        const runner = new OrderClass().dbSpec().database.createTransactionRunner()
        await runner.commit(async (transaction) => {
          for (const orderItem of orderItems.filter((item) => item.businessCode)) {
            const orderFeed = new OrderClass()
            orderFeed.hlyId = orderItem.hlyId
            orderFeed.businessCode = null as any
            orderFeed.fc_edit()
            orderFeed.businessCode = orderItem.businessCode || ''
            await orderFeed.updateToDB(transaction)
          }
        })
      }
    }
  }

  public async dumpOrderHotelRecords(forceReload = false) {
    const syncCore = this.syncCore
    const OrderClass = syncCore.modelsCore.HLY_OrderHotel
    const employeeIdToUserOidMapper = await syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()

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

  public async dumpCtripOrders() {
    const cTripProxy = this.syncCore.cTripProxy
    if (!cTripProxy) {
      return
    }
    const syncCore = this.syncCore
    const CTrip_Order = syncCore.modelsCore.CTrip_Order

    {
      const searcher = new syncCore.modelsCore.HLY_OrderTrain().fc_searcher()
      searcher.processor().setColumns(['hly_id'])
      const feeds = await searcher.queryFeeds()

      await cTripProxy.stepSearchOrderItems(
        feeds.map((item) => item.hlyId),
        async (records, offset) => {
          const dbSpec = new CTrip_Order().dbSpec()
          const bulkAdder = new SQLBulkAdder(dbSpec.database)
          bulkAdder.setTable(dbSpec.table)
          bulkAdder.useUpdateWhenDuplicate()
          bulkAdder.setInsertKeys(dbSpec.insertableCols())
          bulkAdder.declareTimestampKey('created_date')
          for (const record of records) {
            offset += record.TrainOrderInfoList!.length
            console.info(`[dumpCtripOrders trains] ${offset} / ${feeds.length}`)
            for (const orderItem of record.TrainOrderInfoList!) {
              const feed = new CTrip_Order()
              feed.orderId = Number(orderItem.BasicInfo.OrderID)
              feed.orderType = HLY_OrderType.TRAIN
              feed.employeeId = orderItem.BasicInfo.EmployeeID || null
              feed.userName = orderItem.BasicInfo.UserName || ''
              feed.orderStatus = orderItem.BasicInfo.NewOrderStatusName || orderItem.BasicInfo.OrderStatusName
              feed.journeyNo = orderItem.CorpOrderInfo.JourneyID || ''
              feed.createdDate = TimeUtils.correctUTC8Timestamp(orderItem.BasicInfo.DataChange_CreateTime)
              feed.extrasInfo = JSON.stringify(orderItem)
              bulkAdder.putObject(feed.fc_encode())
            }
          }
          await bulkAdder.execute()
        }
      )
    }

    {
      const searcher = new syncCore.modelsCore.HLY_OrderFlight().fc_searcher()
      searcher.processor().setColumns(['hly_id'])
      const feeds = await searcher.queryFeeds()

      await cTripProxy.stepSearchOrderItems(
        feeds.map((item) => item.hlyId),
        async (records, offset) => {
          const dbSpec = new CTrip_Order().dbSpec()
          const bulkAdder = new SQLBulkAdder(dbSpec.database)
          bulkAdder.setTable(dbSpec.table)
          bulkAdder.useUpdateWhenDuplicate()
          bulkAdder.setInsertKeys(dbSpec.insertableCols())
          bulkAdder.declareTimestampKey('created_date')
          for (const record of records) {
            offset += record.FlightOrderInfoList!.length
            console.info(`[dumpCtripOrders flights] ${offset} / ${feeds.length}`)
            for (const orderItem of record.FlightOrderInfoList!) {
              const coreChangeInfo =
                Array.isArray(orderItem.FlightChangeInfo) &&
                orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
                  ? orderItem.FlightChangeInfo[orderItem.FlightChangeInfo.length - 1]
                  : null
              const feed = new CTrip_Order()
              feed.orderId = Number(orderItem.BasicInfo.OrderID)
              feed.orderType = HLY_OrderType.FLIGHT
              feed.employeeId = orderItem.BasicInfo.EmployeeID || null
              feed.userName = orderItem.BasicInfo.PreEmployName || ''
              feed.orderStatus = orderItem.BasicInfo.OrderStatus
              if (coreChangeInfo) {
                if (coreChangeInfo.FlightChangeType === CTrip_FlightChangeType.Canceled) {
                  feed.orderStatus = '航班取消'
                } else if (
                  [
                    CTrip_FlightChangeType.Changed,
                    CTrip_FlightChangeType.Delayed,
                    CTrip_FlightChangeType.Recovery,
                  ].includes(coreChangeInfo.FlightChangeType)
                ) {
                  feed.orderStatus = '航班变更'
                }
              }
              feed.journeyNo = orderItem.BasicInfo.JourneyID || ''
              feed.createdDate = TimeUtils.correctUTC8Timestamp(orderItem.BasicInfo.CreateTime)
              feed.extrasInfo = JSON.stringify(orderItem)
              bulkAdder.putObject(feed.fc_encode())
            }
          }
          await bulkAdder.execute()
        }
      )
    }
  }
}
