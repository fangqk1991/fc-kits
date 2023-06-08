import { CommonAPI } from '@fangcha/app-request'
import { HLY_CostCenter, HLY_CostCenterItem, HLY_ExpenseType, HLY_SimpleDepartment } from '../core/HuilianyiModels'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BasicDataApis } from './HLY_BasicDataApis'
import { HLY_Staff } from '../core/HLY_CoreModels'

export class HLY_BasicDataProxy extends HuilianyiProxyBase {
  public async getCostCenterList() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.CostCenterListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_CostCenter[]>()
    })
  }

  public async getEnabledCostCenterList() {
    const items = await this.getCostCenterList()
    return items.filter((item) => item.enabled)
  }

  public async getCostCenterDetail(code: string) {
    const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.CostCenterDetailGet))
    request.setBodyData({
      code: code,
    })
    return await request.quickSend<HLY_CostCenter>()
  }

  /**
   * 若请求已禁用的成本中心，会报错
   */
  public async getCostCenterItems(code: string) {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.CostCenterItemsGet))
      request.setQueryParams({
        ...params,
        costCenterCode: code,
      })
      return await request.quickSend<HLY_CostCenterItem[]>()
    })
  }

  public async getAllStaffs() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.StaffListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_Staff[]>()
    })
  }

  public async getAllDepartments() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.DepartmentListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_SimpleDepartment[]>()
    })
  }

  /**
   * https://opendocs.huilianyi.com/implement/master-data/expense-type/query-expense-type.html
   */
  public async getExpenseTypeList() {
    const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.ExpenseTypeListGet))
    return await request.quickSend<HLY_ExpenseType[]>()
  }

  private async getAllPageItemsV2<T>(handler: (params: { page: number; size: number }) => Promise<T[]>) {
    let items: T[] = []
    let finished = false
    let page = 1
    while (!finished) {
      const pageItems = await handler({
        startDate: '2020-01-01 00:00:00',
        endDate: '2040-12-31 00:00:00',
        page: page,
        size: 100,
      })
      items = items.concat(pageItems || [])
      if (pageItems.length === 0) {
        finished = true
      } else {
        ++page
      }
    }
    return items
  }
}
