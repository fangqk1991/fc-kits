import { CommonAPI } from '@fangcha/app-request'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BusinessDataApis } from './HLY_BusinessDataApis'
import { HLY_Expense } from '../core/HLY_ReimbursementModels'
import { HLY_ReimburseStatus, HLY_ReimburseStatusDescriptor } from '../core/HLY_ReimburseStatus'
import { PageDataFetcher } from './PageDataFetcher'

export class HLY_BusinessDataProxy extends HuilianyiProxyBase {
  public async getExpenseReportList(options: { statusList?: HLY_ReimburseStatus[] } = {}) {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGet))
      request.setQueryParams({
        ...params,
        status: (options.statusList || HLY_ReimburseStatusDescriptor.values).join(','),
      })
      return await request.quickSend<HLY_Expense[]>()
    })
  }

  public async getTravelApplicationList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<any[]>()
    })
  }
}
