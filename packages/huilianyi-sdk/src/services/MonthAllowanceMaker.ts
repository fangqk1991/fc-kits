import { md5 } from '@fangcha/tools'
import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { App_TravelSubsidyItem, HLY_PrettyStatus, HLY_TravelStatus, HLY_VerifiedStatus } from '../core'

export class MonthAllowanceMaker {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async makeMonthAllowance() {
    const HLY_Travel = this.modelsCore.HLY_Travel
    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKV('travel_status', HLY_TravelStatus.Passed)
    // searcher.processor().addConditionKV('has_subsidy', 1)
    const items = await searcher.queryAllFeeds()
    for (const travelItem of items) {
      const participants = travelItem.extrasData().participants
      const monthSections = travelItem.monthSectionInfos()
      for (const section of monthSections) {
        for (const participant of participants) {
          const subsidyItems: App_TravelSubsidyItem[] = []
          for (const item of section.itineraryItems) {
            subsidyItems.push(
              ...item.subsidyList.filter(
                (item) => item.date.startsWith(section.month) && item.userOID === participant.userOID
              )
            )
          }

          // const allowanceItems: App_TravelAllowanceItem[] = []
          // let lastDate = '1970-01-01'
          // for (const item of section.itineraryItems) {
          //   const startDate = TimeUtils.max(item.startDate, monthStartDate, lastDate)
          //   const endDate = TimeUtils.min(item.endDate, monthEndDate)
          //   if (TimeUtils.diff(startDate, endDate) > 0) {
          //     break
          //   }
          //   lastDate = moment(endDate).add(1, 'days').format('YYYY-MM-DD')
          //   const daysCount = moment(endDate).diff(moment(startDate), 'days') + 1
          //   const allowanceAmount = daysCount * 100
          //   allowanceItems.push({
          //     startDate: startDate,
          //     endDate: endDate,
          //     city: item.toCityName,
          //     daysCount: daysCount,
          //     allowanceAmount: allowanceAmount,
          //   })
          // }
          const trafficItem = travelItem
            .employeeTrafficItems()
            .find((trafficItem) => trafficItem.employeeName === participant.fullName)
          const isPretty = !!trafficItem && trafficItem.isClosedLoop
          const allowance = new HLY_TravelAllowance()
          allowance.businessCode = travelItem.businessCode
          allowance.targetMonth = section.month
          allowance.applicantOid = participant.userOID
          allowance.applicantName = participant.fullName
          allowance.title = travelItem.title
          allowance.uid = md5([travelItem.businessCode, section.month, participant.userOID].join(','))
          allowance.daysCount = subsidyItems.length
          allowance.amount = subsidyItems.reduce((result, cur) => result + cur.amount, 0)
          allowance.subsidyItemsStr = JSON.stringify(subsidyItems)
          allowance.detailItemsStr = JSON.stringify([])
          allowance.extrasInfo = JSON.stringify({
            closedLoopTickets: isPretty ? trafficItem.tickets : [],
            itineraryItems: section.itineraryItems,
          })
          allowance.isPretty = isPretty ? HLY_PrettyStatus.Pretty : HLY_PrettyStatus.NotPretty
          allowance.isVerified = isPretty ? HLY_VerifiedStatus.Verified : HLY_VerifiedStatus.NotVerified
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
      const sql = `INSERT INTO ${snapshotTable} (${allowanceColumnsStr}) SELECT ${allowanceColumnsStr} FROM \`${allowanceDBSpec.table}\` WHERE target_month = ?`
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
}
