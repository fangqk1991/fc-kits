import { SystemConfigHandler } from './SystemConfigHandler'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { CostMonthlyReport, CostOwnerReport, RetainConfigKey } from '../core/App_CoreModels'
import * as moment from 'moment'

export class PublicPaymentService {
  public readonly syncCore: HuilianyiSyncCore

  constructor(syncCore: HuilianyiSyncCore) {
    this.syncCore = syncCore
  }

  public async getCostOwnerReports() {
    const syncCore = this.syncCore
    const modelsCore = syncCore.modelsCore

    const N = await new SystemConfigHandler(syncCore.modelsCore, syncCore).getConfig(
      RetainConfigKey.ExpenseAvgMonthN,
      async () => {
        return 3
      }
    )

    const endMoment = moment().utcOffset('+08:00').startOf('month')
    const startMoment = moment(endMoment).subtract(N, 'month')

    const items = await modelsCore.HLY_PublicPayment.getAggregationData<CostMonthlyReport>({
      columns: [
        'cost_owner_oid AS costOwnerOid',
        'DATE_FORMAT(created_date, "%Y-%m") AS month',
        'COUNT(*) AS count',
        'SUM(total_amount) AS totalAmount',
      ],
      groupByKeys: ['costOwnerOid', 'month'],
      customHandler: (searcher) => {
        searcher.addSpecialCondition(
          'created_date >= FROM_UNIXTIME(?) AND created_date < FROM_UNIXTIME(?)',
          startMoment.unix(),
          endMoment.unix()
        )
        searcher.setOptionStr('ORDER BY month ASC')
      },
    })
    const ownerMapper: {
      [p: string]: CostOwnerReport
    } = {}
    for (const item of items) {
      if (!ownerMapper[item.costOwnerOid]) {
        ownerMapper[item.costOwnerOid] = {
          costOwnerOid: item.costOwnerOid,
          totalCount: 0,
          totalAmount: 0,
          avgAmount: 0,
          monthItems: [],
        }
      }
      ownerMapper[item.costOwnerOid].monthItems.push({
        costOwnerOid: item.costOwnerOid,
        month: item.month,
        totalCount: item.totalCount,
        totalAmount: item.totalAmount,
      })
    }
    const ownerList = Object.values(ownerMapper)
    for (const owner of ownerList) {
      owner.totalCount = owner.monthItems.reduce((result, cur) => result + cur.totalCount, 0)
      owner.totalAmount = owner.monthItems.reduce((result, cur) => result + cur.totalAmount, 0)
      owner.avgAmount = owner.totalAmount / owner.monthItems.length
    }
    return ownerList
  }
}
