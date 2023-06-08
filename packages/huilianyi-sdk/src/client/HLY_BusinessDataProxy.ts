import { CommonAPI } from '@fangcha/app-request'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BusinessDataApis } from './HLY_BusinessDataApis'
import { HLY_Expense } from '../core/HLY_ReimbursementModels'
import { HLY_ReimburseStatus, HLY_ReimburseStatusDescriptor } from '../core/HLY_ReimburseStatus'

export class HLY_BusinessDataProxy extends HuilianyiProxyBase {
  public async getExpenseReportList(params: { statusList?: HLY_ReimburseStatus[] } = {}) {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.ExpenseReportListGet))
    request.setQueryParams({
      startDate: '2020-01-01 00:00:00',
      endDate: '2040-12-31 00:00:00',
      status: (params.statusList || HLY_ReimburseStatusDescriptor.values).join(','),
      size: 100,
    })
    return await request.quickSend<HLY_Expense[]>()
  }

  public async getTravelApplicationList() {
    const request = await this.makeRequest(new CommonAPI(HLY_BusinessDataApis.TravelApplicationListGet))
    request.setQueryParams({
      startDate: '2020-01-01 00:00:00',
      endDate: '2040-12-31 00:00:00',
      // status: [1001, 1002, 1003, 1004, 1005, 1007, 1008, 1015].join(','),
      size: 100,
    })
    return await request.quickSend<any>()
  }
}
