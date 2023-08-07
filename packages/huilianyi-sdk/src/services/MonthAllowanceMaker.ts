import { md5 } from '@fangcha/tools'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import {
  AllowanceCalculator,
  App_TravelAllowanceExtrasData,
  HLY_PrettyStatus,
  HLY_TravelStatus,
  HLY_VerifiedStatus,
} from '../core'
import { HuilianyiFormatter } from '../client/HuilianyiFormatter'

export class MonthAllowanceMaker {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
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
        const staff = (await this.modelsCore.HLY_Staff.findWithUid(participant.userOID))!
        const closedLoops = trafficItem.closedLoops || []
        const dayItems = calculator.calculateAllowanceDayItems(staff.groupCodes(), closedLoops)

        for (const month of monthList) {
          const subDayItems = dayItems.filter((dayItem) => dayItem.date.startsWith(month))
          const allowance = new HLY_TravelAllowance()
          allowance.businessCode = travelItem.businessCode
          allowance.targetMonth = month
          allowance.applicantOid = participant.userOID
          allowance.applicantName = participant.fullName
          allowance.title = travelItem.title
          allowance.uid = md5([travelItem.businessCode, month, participant.userOID].join(','))
          allowance.daysCount = subDayItems.reduce((result, cur) => result + (cur.halfDay ? 0.5 : 1), 0)
          allowance.amount = subDayItems.reduce((result, cur) => result + cur.amount, 0)
          allowance.subsidyItemsStr = JSON.stringify([])
          allowance.detailItemsStr = JSON.stringify(subDayItems)
          allowance.extrasInfo = JSON.stringify({
            closedLoops: closedLoops,
            itineraryItems: itineraryItems,
          } as App_TravelAllowanceExtrasData)
          allowance.isPretty = HLY_PrettyStatus.Pretty
          allowance.isVerified = HLY_VerifiedStatus.Verified
          allowance.version = travelItem.version
          await allowance.strongAddToDB()
        }
      }
    }
  }

  public async makeAllowanceSnapshot(month: string) {
    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const HLY_AllowanceSnapshot = this.modelsCore.HLY_AllowanceSnapshot
    const HLY_SnapshotLog = this.modelsCore.HLY_SnapshotLog

    if (await HLY_SnapshotLog.findWithUid(month)) {
      console.warn(`${month}'s AllowanceSnapshot has been created.`)
      return
    }

    const allowanceDBSpec = new HLY_TravelAllowance().dbSpec()
    const database = allowanceDBSpec.database
    const runner = await database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      const snapshotTable = new HLY_AllowanceSnapshot().dbSpec().table
      const allowanceColumnsStr = allowanceDBSpec
        .insertableCols()
        .map((item) => `\`${item}\``)
        .join(', ')
      const sql = `INSERT INTO ${snapshotTable} (${allowanceColumnsStr})
                   SELECT ${allowanceColumnsStr}
                   FROM \`${allowanceDBSpec.table}\`
                   WHERE target_month = ?`
      await database.update(sql, [month], transaction)

      const searcher = new HLY_AllowanceSnapshot().fc_searcher()
      searcher.processor().transaction = transaction
      searcher.processor().addConditionKV('target_month', month)
      const count = await searcher.queryCount()

      if (count > 0) {
        const snapshotLog = new HLY_SnapshotLog()
        snapshotLog.targetMonth = month
        snapshotLog.recordCount = count
        await snapshotLog.addToDB(transaction)
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
}
