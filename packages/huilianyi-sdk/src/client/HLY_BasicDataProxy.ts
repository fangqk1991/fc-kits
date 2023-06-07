import { CommonAPI } from '@fangcha/app-request'
import { HLY_ExpenseType, HLY_SimpleDepartment, HLY_Staff } from '../core/HuilianyiModels'
import { HuilianyiProxy } from './HuilianyiProxy'
import { HLY_BasicDataApis } from './HLY_BasicDataApis'
import { HuilianyiApis } from './HuilianyiApis'

export class HLY_BasicDataProxy extends HuilianyiProxy {
  public async getAllStaffs() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HuilianyiApis.StaffListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_Staff[]>()
    })
  }

  public async getAllDepartments() {
    return await this.getAllPageItemsV2(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HuilianyiApis.DepartmentListGet))
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
