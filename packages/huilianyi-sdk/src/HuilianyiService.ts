import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig, md5 } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'
import { App_TravelSubsidyItem, RetainConfigKey } from './core/App_CoreModels'
import { HLY_TravelStatus } from './core/HLY_TravelStatus'
import { HLY_PrettyStatus } from './core/HLY_PrettyStatus'
import { HLY_VerifiedStatus } from './core/HLY_VerifiedStatus'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiService {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(options: Options) {
    this.modelsCore = new HuilianyiModelsCore(options.database)
    this.syncCore = new HuilianyiSyncCore({
      authConfig: options.authConfig,
      modelsCore: this.modelsCore,
    })
  }

  public syncHandler() {
    return new HuilianyiSyncHandler(this.syncCore)
  }

  public async setConfig(key: string, value: any) {
    const feed = new this.modelsCore.HLY_Config()
    feed.configKey = key
    feed.configDataStr = JSON.stringify({
      data: value,
    })
    await feed.strongAddToDB()
    return feed
  }

  public async getConfig(key: string, fetchFunc?: () => Promise<any>) {
    let feed = await this.modelsCore.HLY_Config.findWithUid(key)
    if (!feed) {
      feed = await this.setConfig(key, fetchFunc ? await fetchFunc() : null)
    }
    return feed.configData()
  }

  public async reloadExpenseTypeMetadata() {
    const dataList = await this.syncCore.basicDataProxy.getExpenseTypeList()
    const mapper = dataList.reduce((result, cur) => {
      result[cur.code] = cur.name
      return result
    }, {})
    await this.setConfig(RetainConfigKey.ExpenseTypeMetadata, mapper)
    return mapper
  }

  public async getExpenseTypeMetadata() {
    return await this.getConfig(RetainConfigKey.ExpenseTypeMetadata, async () => {
      return this.reloadExpenseTypeMetadata()
    })
  }

  public async makeMonthAllowance() {
    const HLY_Travel = this.modelsCore.HLY_Travel
    const HLY_TravelAllowance = this.modelsCore.HLY_TravelAllowance
    const searcher = new HLY_Travel().fc_searcher()
    searcher.processor().addConditionKV('travel_status', HLY_TravelStatus.Passed)
    searcher.processor().addConditionKV('has_subsidy', 1)
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
            itineraryItems: section.itineraryItems,
          })
          allowance.isPretty = HLY_PrettyStatus.NotPretty
          allowance.isVerified = HLY_VerifiedStatus.NotVerified
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
