import { SystemConfigHandler } from './SystemConfigHandler'
import { HuilianyiSyncCore } from './HuilianyiSyncCore'
import { CostMonthlyReport, CostOwnerReport, RetainConfigKey } from '../core/basic/App_CoreModels'
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

    const endMoment = moment().utcOffset('+08:00', true).startOf('month')
    const startMoment = moment(endMoment).subtract(N, 'month')

    const items = await modelsCore.HLY_PublicPayment.getAggregationData<CostMonthlyReport>({
      columns: [
        'cost_type_oid AS costTypeOid',
        'cost_owner_oid AS costOwnerOid',
        'DATE_FORMAT(created_date, "%Y-%m") AS month',
        'COUNT(*) AS totalCount',
        'SUM(total_amount) AS totalAmount',
      ],
      groupByKeys: ['costTypeOid', 'costOwnerOid', 'month'],
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
      const key = `${item.costOwnerOid}|${item.costOwnerOid}`
      if (!ownerMapper[key]) {
        ownerMapper[key] = {
          costTypeOid: item.costTypeOid,
          costOwnerOid: item.costOwnerOid,
          totalCount: 0,
          totalAmount: 0,
          avgAmount: 0,
          monthItems: [],
        }
      }
      ownerMapper[key].monthItems.push({
        costTypeOid: item.costTypeOid,
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
