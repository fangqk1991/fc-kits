import { CommonAPI } from '@fangcha/app-request'
import {
  HLY_CostCenter,
  HLY_CostCenterItem,
  HLY_ExpenseTypeEntity,
  HLY_SimpleDepartment,
  HLY_User,
  HLY_UserGroup,
  HuilianyiResponse,
} from '../core/HuilianyiModels'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_BasicDataApis } from './HLY_BasicDataApis'
import { HLY_Staff } from '../core/HLY_CoreModels'
import { PageDataFetcher } from './PageDataFetcher'

export class HLY_BasicDataProxy extends HuilianyiProxyBase {
  public async getCostCenterList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
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
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.CostCenterItemsGet))
      request.setQueryParams({
        ...params,
        costCenterCode: code,
      })
      return await request.quickSend<HLY_CostCenterItem[]>()
    })
  }

  public async getAllStaffs() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.StaffListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_Staff[]>()
    })
  }
  public async getUserGroupList() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.UserGroupListGet))
      request.setQueryParams({
        ...params,
      })
      const response = (await request.quickSend()) as HuilianyiResponse<HLY_UserGroup[]>
      return response.data
    })
  }

  public async getUserGroupMembers(groupCode: string) {
    const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.UserGroupMembersGet, groupCode))
    return await request.quickSend<HLY_User[]>()
  }

  public async getAllDepartments() {
    return await PageDataFetcher.fetchAllPageItems(async (params) => {
      const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.DepartmentListGet))
      request.setQueryParams({
        ...params,
      })
      return await request.quickSend<HLY_SimpleDepartment[]>()
    })
  }

  public async getDepartmentInfo(departmentOID: string) {
    const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.DepartmentInfoGet, departmentOID))
    return await request.quickSend<HLY_SimpleDepartment>()
  }

  /**
   * https://opendocs.huilianyi.com/implement/master-data/expense-type/query-expense-type.html
   */
  public async getExpenseTypeList() {
    const request = await this.makeRequest(new CommonAPI(HLY_BasicDataApis.ExpenseTypeListGet))
    return await request.quickSend<HLY_ExpenseTypeEntity[]>()
  }
}
