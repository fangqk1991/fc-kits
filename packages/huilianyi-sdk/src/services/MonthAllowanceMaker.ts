import { md5 } from '@fangcha/tools'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  AllowanceCalculator,
  App_ClosedLoop,
  App_TrafficTicket,
  App_TravelAllowanceExtrasData,
  HLY_AllowanceCase,
  HLY_TravelStatus,
  TravelTools,
} from '../core'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import assert from '@fangcha/assert'
import { SQLModifier, SQLRemover } from 'fc-sql'
import * as moment from 'moment'
import { _HLY_TravelAllowance } from '../models/extensions/_HLY_TravelAllowance'
import { SystemConfigHandler } from './SystemConfigHandler'

export class MonthAllowanceMaker {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
    this.modelsCore = syncCore.modelsCore
  }

  public async makeMonthAllowance(AllowanceClass?: { new (): _HLY_TravelAllowance } & typeof _HLY_TravelAllowance) {
    const rules = await this.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    AllowanceClass = AllowanceClass || this.modelsCore.HLY_TravelAllowance

    const HLY_Travel = this.modelsCore.HLY_Travel
    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKV('travel_status', HLY_TravelStatus.Passed)
    if (AllowanceClass === this.modelsCore.HLY_TravelAllowance) {
      searcher.processor().addConditionKV('match_closed_loop', 1)
    }
    const items = await searcher.queryAllFeeds()

    const staffMapper = (await this.modelsCore.HLY_Staff.staffMapper())!
    const companyMapper = await new SystemConfigHandler(this.syncCore).getCompanyMetadata()
    for (const travelItem of items) {
      const extrasData = travelItem.extrasData()
      const participants = extrasData.participants
      const itineraryItems = travelItem.itineraryItems()
      for (const participant of participants) {
        const trafficItem = travelItem
          .employeeTrafficItems()
          .find((trafficItem) => trafficItem.employeeName === participant.fullName)
        let closedLoops: App_ClosedLoop[] = []
        let tickets: App_TrafficTicket[] = []
        if (trafficItem) {
          closedLoops = trafficItem.closedLoops || []
          tickets = trafficItem.tickets || []
        }

        const monthList =
          tickets.length === 0
            ? HuilianyiFormatter.extractMonthList(travelItem.startTime!, travelItem.endTime!)
            : HuilianyiFormatter.extractMonthList(tickets[0].fromTime, tickets[tickets.length - 1].toTime)

        const staff = staffMapper[participant.userOID]
        if (!staff) {
          console.error(`Staff[${participant.userOID}] ${participant.fullName} missing.`)
          continue
        }
        if (staff.withoutAllowance) {
          continue
        }

        const company = companyMapper[staff.companyCode!]

        const dayItems = calculator.calculateAllowanceDayItems(
          {
            roleCodeList: staff.groupCodes(),
            withoutAllowance: staff.withoutAllowance,
          },
          closedLoops
        )

        let allowanceCase = HLY_AllowanceCase.Case_5
        if (closedLoops.length > 0) {
          allowanceCase = HLY_AllowanceCase.Case_1
        } else if (tickets.length > 0) {
          allowanceCase = HLY_AllowanceCase.Case_2
        } else if (tickets.length === 0) {
          allowanceCase = HLY_AllowanceCase.Case_3
        }
        for (const month of monthList) {
          const subDayItems = dayItems.filter((dayItem) => dayItem.date.startsWith(month))
          const allowance = new AllowanceClass()
          allowance.businessCode = travelItem.businessCode
          allowance.targetMonth = month
          allowance.applicantOid = participant.userOID
          allowance.applicantName = participant.fullName
          allowance.baseCity = staff.baseCity || ''
          allowance.companyOid = company ? company.companyOID : null
          allowance.companyName = company ? company.name : ''
          allowance.costOwnerOid = travelItem.costOwnerOid
          allowance.costOwnerName = travelItem.costOwnerName || ''
          allowance.title = travelItem.title
          allowance.startTime = travelItem.startTime
          allowance.endTime = travelItem.endTime
          allowance.withoutAllowance = staff.withoutAllowance
          allowance.uid = md5([travelItem.businessCode, month, participant.userOID].join(','))

          const prevAllowance = await AllowanceClass.findWithUid(allowance.uid)
          const coreData = TravelTools.makeAllowanceCoreData(
            prevAllowance && prevAllowance.useCustom ? prevAllowance.customData().detailItems : subDayItems
          )
          allowance.daysCount = coreData.daysCount
          allowance.amount = coreData.amount
          allowance.detailItemsStr = JSON.stringify(subDayItems)
          allowance.extrasInfo = JSON.stringify({
            tickets: tickets,
            closedLoops: closedLoops,
            itineraryItems: itineraryItems,
          } as App_TravelAllowanceExtrasData)
          allowance.isPretty = closedLoops.length > 0 ? 1 : 0
          allowance.isVerified = allowance.isPretty
          allowance.version = travelItem.version
          allowance.payAmount = allowance.amount
          allowance.snapHash = md5([allowance.uid, allowance.daysCount, allowance.amount].join(','))
          allowance.allowanceCase = allowanceCase
          await allowance.strongAddToDB()
        }
      }
    }

    {
      const allowanceDbSpec = new AllowanceClass().dbSpec()
      const remover = new SQLRemover(allowanceDbSpec.database)
      remover.setTable(allowanceDbSpec.table)
      remover.addConditionKeyNotInArray(
        'business_code',
        items.map((item) => item.businessCode)
      )
      await remover.execute()
    }

    await this.removeExpiredAllowanceRecords(AllowanceClass)
  }

  public async findToFixAllowanceData(month: string) {
    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const HLY_AllowanceSnapshot = this.modelsCore.HLY_AllowanceSnapshot
    const snapshotTable = new HLY_AllowanceSnapshot().dbSpec().table
    const curTable = new HLY_TravelAllowance().dbSpec().table
    const todoData: {
      toInsertItems: _HLY_TravelAllowance[]
      toUpdateItems: _HLY_TravelAllowance[]
    } = {
      toInsertItems: [],
      toUpdateItems: [],
    }
    {
      const searcher = new HLY_TravelAllowance().fc_searcher()
      searcher
        .processor()
        .addSpecialCondition(
          `NOT EXISTS (SELECT ${snapshotTable}.uid FROM ${snapshotTable} WHERE ${snapshotTable}.uid = ${curTable}.uid)`
        )
      searcher.processor().addSpecialCondition(`target_month <= ?`, month)
      todoData.toInsertItems = await searcher.queryAllFeeds()
    }
    {
      const searcher = new HLY_TravelAllowance().fc_searcher()
      searcher
        .processor()
        .addSpecialCondition(
          `EXISTS (SELECT ${snapshotTable}.uid FROM ${snapshotTable} WHERE ${snapshotTable}.uid = ${curTable}.uid)`
        )
      searcher
        .processor()
        .addSpecialCondition(
          `NOT EXISTS (SELECT ${snapshotTable}.uid FROM ${snapshotTable} WHERE ${snapshotTable}.snap_hash = ${curTable}.snap_hash)`
        )
      searcher.processor().addSpecialCondition(`target_month <= ?`, month)
      todoData.toUpdateItems = await searcher.queryAllFeeds()
    }
    return todoData
  }

  public async checkSnapshotMonthLocked(month: string) {
    const searcher = new this.modelsCore.HLY_AllowanceSnapshot().fc_searcher()
    searcher.processor().addConditionKV('snap_month', month)
    searcher.processor().addConditionKV('is_locked', 1)
    return (await searcher.queryCount()) > 0
  }

  public async makeAllowanceSnapshot(month: string) {
    assert.ok(!(await this.checkSnapshotMonthLocked(month)), `${month} 快照已锁定，不可重新生成`)

    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const HLY_AllowanceSnapshot = this.modelsCore.HLY_AllowanceSnapshot
    const HLY_SnapshotLog = this.modelsCore.HLY_SnapshotLog

    const snapshotLog = await HLY_SnapshotLog.findWithMonth(month)

    const searcher = new HLY_TravelAllowance().fc_searcher()
    searcher.processor().addConditionKV('target_month', month)
    const allowanceList = await searcher.queryAllFeeds()

    const database = new HLY_TravelAllowance().dbSpec().database
    const runner = await database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      const snapshotDbSpec = new HLY_AllowanceSnapshot().dbSpec()

      const remover = new SQLRemover(database)
      remover.transaction = transaction
      remover.setTable(snapshotDbSpec.table)
      remover.addConditionKV('snap_month', month)
      remover.addConditionKV('is_locked', 0)
      await remover.execute()

      for (const allowanceItem of allowanceList) {
        const snapshot = new HLY_AllowanceSnapshot()
        snapshot.fc_generateWithModel(allowanceItem.fc_pureModel())
        snapshot.snapMonth = month
        snapshot.isPrimary = 1
        await snapshot.addToDB(transaction)
      }
      if (!snapshotLog) {
        const snapshotLog = new HLY_SnapshotLog()
        snapshotLog.snapMonth = month
        await snapshotLog.addToDB(transaction)
      } else {
        snapshotLog.fc_edit()
        snapshotLog.version = snapshotLog.version + 1
        await snapshotLog.updateToDB(transaction)
      }
    })
  }

  public async removeExpiredAllowanceRecords(
    AllowanceClass: { new (): _HLY_TravelAllowance } & typeof _HLY_TravelAllowance
  ) {
    const table = new AllowanceClass().dbSpec().table
    const searcher = new AllowanceClass().fc_searcher()
    searcher
      .processor()
      .addSpecialCondition(
        `EXISTS (SELECT hly_travel.business_code FROM hly_travel WHERE hly_travel.business_code = ${table}.business_code AND (hly_travel.version != ${table}.version OR hly_travel.travel_status != ?))`,
        HLY_TravelStatus.Passed
      )
    const items = await searcher.queryAllFeeds()
    console.info(`[removeExpiredAllowanceRecords] ${items.length} items.`)

    for (const item of items) {
      console.info(
        `[removeExpiredAllowanceRecords] delete ${item.targetMonth} ${item.applicantName} ${item.businessCode} ${item.version}`
      )
      await item.deleteFromDB()
    }
  }

  public async lockAllowanceSnapshots() {
    const dbSpec = new this.modelsCore.HLY_AllowanceSnapshot().dbSpec()
    const modifier = new SQLModifier(dbSpec.database)
    modifier.setTable(dbSpec.table)
    modifier.updateKV('is_locked', 1)
    modifier.addSpecialCondition('STRCMP(target_month, ?) = -1', moment().format('YYYY-MM'))
    await modifier.execute()
  }
}
