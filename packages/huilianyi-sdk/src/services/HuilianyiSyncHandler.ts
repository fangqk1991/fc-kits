import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { FeedBase } from 'fc-feed'
import { SQLBulkAdder, SQLSearcher, Transaction } from 'fc-sql'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HLY_Company, HLY_OrderType, HLY_StaffRole, HLY_TravelParticipant, HLY_TravelStatus, TimeUtils, } from '../core'
import { _HLY_StaffGroup } from '../models/extensions/_HLY_StaffGroup'
import { md5 } from '@fangcha/tools'
import { _Dummy_Travel } from '../models/extensions/_Dummy_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'
import {
  CTrip_FlightChangeInfoEntity,
  CTrip_FlightChangeType,
  CTrip_FlightOrderInfoEntity,
  CTrip_OrderType,
  CTrip_TrainOrderInfoEntity,
} from '@fangcha/ctrip-sdk'
import { SystemConfigHandler } from './SystemConfigHandler'
import * as moment from 'moment'

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
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((item) => !['base_city', 'without_allowance'].includes(item))
    )
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
    const companyMapper = await new SystemConfigHandler(syncCore).getCompanyMetadata()
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

    const costCenterMetadata = await new SystemConfigHandler(this.syncCore).getCostCenterMetadata()
    const costOwnerItemsMap = costCenterMetadata['YSGK']?.itemMap || {}
    console.info(`[dumpTravelRecords] ${todoItems.length} items need to reload.`)
    for (const item of todoItems) {
      const travelInfo = await syncCore.dataProxy.getTravelApplicationDetail(item.businessCode)
      const props = HuilianyiFormatter.transferTravelModel(travelInfo)
      if (costOwnerItemsMap[props.costOwnerOid]) {
        props.costOwnerName = costOwnerItemsMap[props.costOwnerOid].name
      }
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

  public async fetchCtripOrderIds(startTime?: string) {
    const cTripProxy = this.syncCore.cTripProxy
    if (!cTripProxy) {
      return []
    }

    startTime = startTime || '2023-06-01 00:00:00'
    const curMoment = TimeUtils.momentUTC8(startTime).startOf('month')
    let orderIdList: number[] = []
    while (curMoment.valueOf() < moment().valueOf()) {
      const toMoment = moment(Math.min(moment(curMoment).add(1, 'month').valueOf(), moment().valueOf()))
      const idList = await cTripProxy.queryOrderIdList(
        {
          from: TimeUtils.timeStrUTC8(curMoment.format()),
          to: TimeUtils.timeStrUTC8(toMoment.format()),
        },
        {
          SearchTypes: [1, 3],
        }
      )
      curMoment.add(1, 'month')
      orderIdList = orderIdList.concat(idList)
    }
    return orderIdList
  }

  public async dumpCtripOrders() {
    const cTripProxy = this.syncCore.cTripProxy
    if (!cTripProxy) {
      return
    }
    const syncCore = this.syncCore
    const CTrip_Order = syncCore.modelsCore.CTrip_Order

    const orderIdList = await this.fetchCtripOrderIds()

    const dbSpec = new CTrip_Order().dbSpec()
    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(['order_id'])
    for (const orderId of orderIdList) {
      bulkAdder.putObject({
        order_id: orderId,
      })
    }
    await bulkAdder.execute()

    {
      const searcher = new syncCore.modelsCore.CTrip_Order().fc_searcher()
      searcher.processor().setColumns(['order_id'])
      searcher.processor().addConditionKV('is_locked', 0)
      const feeds = await searcher.queryFeeds()
      console.info(`CTrip_Order: ${feeds.length} items to refresh.`)

      await cTripProxy.stepSearchOrderItems(
        feeds.map((item) => item.orderId),
        async (records, offset) => {
          const dbSpec = new CTrip_Order().dbSpec()
          const bulkAdder = new SQLBulkAdder(dbSpec.database)
          bulkAdder.setTable(dbSpec.table)
          bulkAdder.useUpdateWhenDuplicate()
          bulkAdder.setInsertKeys(dbSpec.insertableCols())
          bulkAdder.declareTimestampKey('created_date')
          for (const record of records) {
            if (record.TrainOrderInfoList) {
              offset += record.TrainOrderInfoList.length
              console.info(`[dumpCtripOrders] ${offset} / ${feeds.length}`)
              for (const orderItem of record.TrainOrderInfoList) {
                const feed = new CTrip_Order()
                feed.orderId = Number(orderItem.BasicInfo.OrderID)
                feed.orderType = HLY_OrderType.TRAIN
                feed.employeeId = orderItem.BasicInfo.EmployeeID || null
                feed.userName = orderItem.BasicInfo.UserName || ''
                feed.orderStatus = orderItem.BasicInfo.NewOrderStatusName || orderItem.BasicInfo.OrderStatusName
                feed.changeStatus = orderItem.BasicInfo.ChangeTicketStatusName || ''
                feed.journeyNo = orderItem.CorpOrderInfo.JourneyID || ''
                feed.businessCode =
                  feed.journeyNo && /^[\w]{10}-[\w-]+$/.test(feed.journeyNo) ? feed.journeyNo.split('-')[0] : ''
                feed.createdDate = TimeUtils.correctUTC8Timestamp(orderItem.BasicInfo.DataChange_CreateTime)
                feed.extrasInfo = JSON.stringify(orderItem)
                bulkAdder.putObject(feed.fc_encode())
              }
            }
            if (record.FlightOrderInfoList) {
              offset += record.FlightOrderInfoList.length
              console.info(`[dumpCtripOrders] ${offset} / ${feeds.length}`)
              for (const orderItem of record.FlightOrderInfoList) {
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
                feed.changeStatus = ''
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
          }
          await bulkAdder.execute()
        }
      )
    }
  }

  public async extractTrainTicketsFromOrders() {
    const CTrip_Order = this.syncCore.modelsCore.CTrip_Order
    const CTrip_Ticket = this.syncCore.modelsCore.CTrip_Ticket
    const employeeIdToUserOidMapper = await this.syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await this.syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await this.syncCore.modelsCore.HLY_Staff.staffMapper()

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', CTrip_OrderType.TRAIN)
    const feeds = await searcher.queryFeeds()

    const dbSpec = new CTrip_Ticket().dbSpec()

    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((item) => !['business_code', 'deprecated_id'].includes(item))
    )
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')

    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_TrainOrderInfoEntity

      // console.info(`------------------- ${item.orderId} -------------------`)
      const ticketInfoList = extrasData.TicketInfoList
      // console.info(
      //   'Trains: ',
      //   ticketInfoList
      //     .map((item) => `${item.TrainName} ${item.DepartureDateTime} ~ ${item.ArrivalDateTime}`)
      //     .join(' | ')
      // )
      const hasChanged = !!ticketInfoList.find((item) => item.TrainTicketType === 'C')
      for (const passenger of extrasData.PassengerInfoList) {
        // console.info(passenger.EmployeeID, passenger.PassengerName)
        for (let i = 0; i < ticketInfoList.length; ++i) {
          const ticketInfo = ticketInfoList[i]
          const ticket = new CTrip_Ticket()
          ticket.orderType = item.orderType!
          ticket.orderId = item.orderId
          ticket.infoId = `${ticketInfo.ElectronicOrderNo}`
          ticket.employeeId = passenger.EmployeeID
          ticket.userName = passenger.PassengerName
          {
            ticket.userOid = employeeIdToUserOidMapper[ticket.employeeId] || ''
            if (
              !ticket.userOid &&
              nameToUserOidsMapper[ticket.userName] &&
              nameToUserOidsMapper[ticket.userName].length === 1
            ) {
              ticket.userOid = nameToUserOidsMapper[ticket.userName][0]
            }
            ticket.baseCity = ticket.userOid && staffMapper[ticket.userOid] ? staffMapper[ticket.userOid].baseCity : ''
          }
          ticket.journeyNo = item.journeyNo
          // ticket.businessCode = item.businessCode
          ticket.ctripStatus = item.orderStatus
          ticket.trafficCode = ticketInfo.TrainName
          ticket.fromTime = TimeUtils.correctUTC8Timestamp(ticketInfo.DepartureDateTime)
          ticket.toTime = TimeUtils.correctUTC8Timestamp(ticketInfo.ArrivalDateTime)
          ticket.fromCity = ticketInfo.DepartureCityName
          ticket.toCity = ticketInfo.ArrivalCityName
          ticket.ticketId = md5(
            [
              ticket.orderType,
              ticket.orderId,
              ticket.infoId,
              ticket.userOid || ticket.userName,
              ticket.trafficCode,
            ].join(',')
          )
          if (hasChanged && ticketInfo.TrainTicketType === 'D') {
            ticket.ctripStatus = '已改签'
          }
          bulkAdder.putObject(ticket.fc_encode())
        }
      }
    }
    await bulkAdder.execute()
  }

  public async extractFlightTicketsFromOrders() {
    const CTrip_Order = this.syncCore.modelsCore.CTrip_Order
    const CTrip_Ticket = this.syncCore.modelsCore.CTrip_Ticket
    const employeeIdToUserOidMapper = await this.syncCore.modelsCore.HLY_Staff.employeeIdToUserOidMapper()
    const nameToUserOidsMapper = await this.syncCore.modelsCore.HLY_Staff.nameToUserOidsMapper()
    const staffMapper = await this.syncCore.modelsCore.HLY_Staff.staffMapper()

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_type', CTrip_OrderType.FLIGHT)
    const feeds = await searcher.queryFeeds()

    const dbSpec = new CTrip_Ticket().dbSpec()

    const bulkAdder = new SQLBulkAdder(dbSpec.database)
    bulkAdder.setTable(dbSpec.table)
    bulkAdder.useUpdateWhenDuplicate()
    bulkAdder.setInsertKeys(
      dbSpec.insertableCols().filter((item) => !['business_code', 'deprecated_id'].includes(item))
    )
    bulkAdder.declareTimestampKey('from_time')
    bulkAdder.declareTimestampKey('to_time')

    for (const item of feeds) {
      const extrasData = item.extrasData() as CTrip_FlightOrderInfoEntity
      // console.info(`------------------- ${item.orderId} -------------------`)
      const flightInfoList = extrasData.FlightInfo
      // console.info(
      //   'Flights: ',
      //   flightInfoList.map((item) => `${item.Flight} ${item.TakeoffTime} ~ ${item.ArrivalTime}`).join(' | ')
      // )
      for (const passenger of extrasData.PassengerInfo) {
        // console.info(passenger.PassengerBasic.CorpEid, passenger.PassengerBasic.PassengerName)
        for (let i = 0; i < flightInfoList.length; ++i) {
          const flightInfo = flightInfoList[i]
          const sequence = passenger.SequenceInfo[i]
          const ticket = new CTrip_Ticket()
          ticket.orderType = item.orderType!
          ticket.orderId = item.orderId
          ticket.infoId = ''
          ticket.employeeId = passenger.PassengerBasic.CorpEid
          ticket.userName = passenger.PassengerBasic.PassengerName
          {
            ticket.userOid = employeeIdToUserOidMapper[ticket.employeeId] || ''
            if (
              !ticket.userOid &&
              nameToUserOidsMapper[ticket.userName] &&
              nameToUserOidsMapper[ticket.userName].length === 1
            ) {
              ticket.userOid = nameToUserOidsMapper[ticket.userName][0]
            }
            ticket.baseCity = ticket.userOid && staffMapper[ticket.userOid] ? staffMapper[ticket.userOid].baseCity : ''
          }
          ticket.journeyNo = item.journeyNo
          ticket.businessCode = item.businessCode
          ticket.ctripStatus = item.orderStatus
          ticket.trafficCode = flightInfo.Flight
          ticket.fromTime = TimeUtils.correctUTC8Timestamp(flightInfo.TakeoffTime)
          ticket.toTime = TimeUtils.correctUTC8Timestamp(flightInfo.ArrivalTime)
          ticket.fromCity = flightInfo.DCityName
          ticket.toCity = flightInfo.ACityName
          ticket.ticketId = md5(
            [
              ticket.orderType,
              ticket.orderId,
              ticket.infoId,
              ticket.userOid || ticket.userName,
              ticket.trafficCode,
            ].join(',')
          )
          if (item.orderStatus === '已成交' && sequence.ChangeInfo) {
            ticket.ctripStatus = '已改签'
            bulkAdder.putObject(ticket.fc_encode())

            for (const changeInfo of sequence.ChangeInfo) {
              ticket.ctripStatus = item.orderStatus
              ticket.trafficCode = changeInfo.CFlight
              ticket.fromTime = TimeUtils.correctUTC8Timestamp(changeInfo.CTakeOffTime)
              ticket.toTime = TimeUtils.correctUTC8Timestamp(changeInfo.CArrivalTime)
              ticket.fromCity = changeInfo.CDCityName
              ticket.toCity = changeInfo.CACityName
              ticket.ticketId = md5(
                [
                  ticket.orderType,
                  ticket.orderId,
                  ticket.infoId,
                  ticket.userOid || ticket.userName,
                  ticket.trafficCode,
                ].join(',')
              )
              bulkAdder.putObject(ticket.fc_encode())
            }
          } else {
            bulkAdder.putObject(ticket.fc_encode())
          }
        }
      }
    }

    await bulkAdder.execute()
  }
}
