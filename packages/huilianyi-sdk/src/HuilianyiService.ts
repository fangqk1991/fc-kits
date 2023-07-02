import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig, md5 } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'
import { App_TravelAllowanceItem, RetainConfigKey } from './core/App_CoreModels'
import * as moment from 'moment'
import { HLY_TravelStatus } from './core/HLY_TravelStatus'
import { TimeUtils } from './core/TimeUtils'

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
    const items = await searcher.queryAllFeeds()
    for (const travelItem of items) {
      const monthSections = travelItem.monthSectionInfos()
      for (const section of monthSections) {
        const monthStartDate = TimeUtils.monthStartDate(section.month)
        const monthEndDate = TimeUtils.monthEndDate(section.month)
        const allowanceItems: App_TravelAllowanceItem[] = []
        let lastDate = '1970-01-01'
        for (const item of section.itineraryItems) {
          const startDate = TimeUtils.max(item.startDate, monthStartDate, lastDate)
          const endDate = TimeUtils.min(item.endDate, monthEndDate)
          if (TimeUtils.diff(startDate, endDate) > 0) {
            break
          }
          lastDate = moment(endDate).add(1, 'days').format('YYYY-MM-DD')
          const daysCount = moment(endDate).diff(moment(startDate), 'days') + 1
          const allowanceAmount = daysCount * 100
          allowanceItems.push({
            startDate: startDate,
            endDate: endDate,
            city: item.toCityName,
            daysCount: daysCount,
            allowanceAmount: allowanceAmount,
          })
        }
        const allowance = new HLY_TravelAllowance()
        allowance.businessCode = travelItem.businessCode
        allowance.targetMonth = section.month
        allowance.applicantOid = travelItem.applicantOid
        allowance.applicantName = travelItem.applicantName
        allowance.title = travelItem.title
        allowance.uid = md5([travelItem.businessCode, section.month, travelItem.applicantOid].join(','))
        allowance.daysCount = allowanceItems.reduce((result, cur) => result + cur.daysCount, 0)
        allowance.amount = allowanceItems.reduce((result, cur) => result + cur.allowanceAmount, 0)
        allowance.detailItemsStr = JSON.stringify(allowanceItems)
        allowance.extrasInfo = JSON.stringify({
          itineraryItems: section.itineraryItems,
        })
        await allowance.strongAddToDB()
      }
    }
    {
      const allowanceList = await new HLY_TravelAllowance().fc_searcher().queryAllFeeds()
      for (const item of allowanceList) {
        console.info(item.fc_pureModel())
      }
    }
  }
}
