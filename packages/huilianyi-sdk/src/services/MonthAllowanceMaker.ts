import { md5 } from '@fangcha/tools'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  AllowanceCalculator,
  App_TravelAllowanceExtrasData,
  HLY_PrettyStatus,
  HLY_TravelStatus,
  HLY_VerifiedStatus,
  TravelTools,
} from '../core'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import assert from '@fangcha/assert'
import { SQLModifier, SQLRemover } from 'fc-sql'
import * as moment from 'moment'
import { _HLY_TravelAllowance } from '../models/extensions/_HLY_TravelAllowance'

export class MonthAllowanceMaker {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
    this.modelsCore = syncCore.modelsCore
  }

  public async makeMonthAllowance() {
    const rules = await this.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)

    const HLY_Travel = this.modelsCore.HLY_Travel
    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKV('travel_status', HLY_TravelStatus.Passed)
    searcher.processor().addConditionKV('match_closed_loop', 1)
    const items = await searcher.queryAllFeeds()

    const staffMapper = (await this.modelsCore.HLY_Staff.staffMapper())!
    const companyMapper = await this.syncCore.othersProxy.getCompanyMapper()

    for (const travelItem of items) {
      const extrasData = travelItem.extrasData()
      const participants = extrasData.participants
      const itineraryItems = travelItem.itineraryItems()
      for (const participant of participants) {
        const trafficItem = travelItem
          .employeeTrafficItems()
          .find((trafficItem) => trafficItem.employeeName === participant.fullName)
        if (!trafficItem || trafficItem.tickets.length === 0) {
          continue
        }
        const monthList = HuilianyiFormatter.extractMonthList(
          trafficItem.tickets[0].fromTime,
          trafficItem.tickets[trafficItem.tickets.length - 1].toTime
        )

        const staff = staffMapper[participant.userOID]
        assert.ok(!!staff, `Staff[${participant.userOID}] missing.`, 500)
        if (staff.withoutAllowance) {
          continue
        }

        const company = companyMapper[staff.companyCode!]

        const closedLoops = trafficItem.closedLoops || []
        const dayItems = calculator.calculateAllowanceDayItems(
          {
            roleCodeList: staff.groupCodes(),
            withoutAllowance: staff.withoutAllowance,
          },
          closedLoops
        )

        for (const month of monthList) {
          const subDayItems = dayItems.filter((dayItem) => dayItem.date.startsWith(month))
          const allowance = new HLY_TravelAllowance()
          allowance.businessCode = travelItem.businessCode
          allowance.targetMonth = month
          allowance.applicantOid = participant.userOID
          allowance.applicantName = participant.fullName
          allowance.companyOid = company ? company.companyOID : null
          allowance.companyName = company ? company.name : ''
          allowance.title = travelItem.title
          allowance.startTime = travelItem.startTime
          allowance.endTime = travelItem.endTime
          allowance.withoutAllowance = staff.withoutAllowance
          allowance.uid = md5([travelItem.businessCode, month, participant.userOID].join(','))

          const prevAllowance = await HLY_TravelAllowance.findWithUid(allowance.uid)
          const coreData = TravelTools.makeAllowanceCoreData(
            prevAllowance && prevAllowance.useCustom ? prevAllowance.customData().detailItems : subDayItems
          )
          allowance.daysCount = coreData.daysCount
          allowance.amount = coreData.amount
          allowance.detailItemsStr = JSON.stringify(subDayItems)
          allowance.extrasInfo = JSON.stringify({
            closedLoops: closedLoops,
            itineraryItems: itineraryItems,
          } as App_TravelAllowanceExtrasData)
          allowance.isPretty = HLY_PrettyStatus.Pretty
          allowance.isVerified = HLY_VerifiedStatus.Verified
          allowance.version = travelItem.version
          allowance.payAmount = allowance.amount
          allowance.snapHash = md5([allowance.uid, allowance.daysCount, allowance.amount].join(','))
          await allowance.strongAddToDB()
        }
      }
    }
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

  public async removeExpiredAllowanceRecords() {
    const searcher = new this.modelsCore.HLY_TravelAllowance().fc_searcher()
    searcher
      .processor()
      .addSpecialCondition(
        'EXISTS (SELECT hly_travel.business_code FROM hly_travel WHERE hly_travel.business_code = hly_travel_allowance.business_code AND (hly_travel.version != hly_travel_allowance.version OR hly_travel.travel_status != ?))',
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
