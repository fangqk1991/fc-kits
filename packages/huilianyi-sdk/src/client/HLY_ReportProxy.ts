import { CommonAPI } from '@fangcha/app-request'
import { HLY_ReportApis } from './HLY_ReportApis'
import { HLY_ExpenseDetail, HLY_Reimbursement, HLY_TravelApplyForm, HuilianyiResponse } from '../core/HuilianyiModels'
import * as moment from 'moment'
import { HuilianyiProxy } from './HuilianyiProxy'

export class HLY_ReportProxy extends HuilianyiProxy {
  public async searchReimbursementData(startYear = 2015) {
    let allItems: HLY_Reimbursement[] = []
    const endYear = moment().year()
    for (let year = startYear; year <= endYear; ++year) {
      const [startDate, endDate] = [`${year}-01-01`, `${year}-12-31`]
      const items = await this.getAllPageItems<HLY_Reimbursement>(async (pageParams) => {
        const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.Report_ReimbursementDataSearch))
        request.setBodyData({
          startDate: startDate,
          endDate: endDate,
          ...pageParams,
        })
        return await request.quickSend<HuilianyiResponse<HLY_Reimbursement[]>>()
      })
      allItems = allItems.concat(items)
    }
    return allItems
  }

  public async searchExpenseDetailsData(startYear = 2015) {
    let allItems: HLY_ExpenseDetail[] = []
    const endYear = moment().year()
    for (let year = startYear; year <= endYear; ++year) {
      const [startDate, endDate] = [`${year}-01-01`, `${year}-12-31`]
      const items = await this.getAllPageItems<HLY_ExpenseDetail>(async (pageParams) => {
        const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.ExpenseDetailsDataSearch))
        request.setBodyData({
          startDate: startDate,
          endDate: endDate,
          ...pageParams,
        })
        return await request.quickSend<HuilianyiResponse<HLY_ExpenseDetail[]>>()
      })
      allItems = allItems.concat(items)
    }
    return allItems
  }

  public async searchTravelApplyData(startYear = 2015) {
    let allItems: HLY_TravelApplyForm[] = []
    const endYear = moment().year()
    for (let year = startYear; year <= endYear; ++year) {
      const [startDate, endDate] = [`${year}-01-01`, `${year}-12-31`]
      const items = await this.getAllPageItems<HLY_TravelApplyForm>(async (pageParams) => {
        const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.TravelApplyDataSearch))
        request.setBodyData({
          startDate: startDate,
          endDate: endDate,
          ...pageParams,
        })
        return await request.quickSend<HuilianyiResponse<HLY_TravelApplyForm[]>>()
      })
      allItems = allItems.concat(items)
    }
    return allItems
  }

  public async searchContractData(setOfBooksCode: string, startYear = 2015) {
    let allItems: HLY_Reimbursement[] = []
    const endYear = moment().year()
    for (let year = startYear; year <= endYear; ++year) {
      const [startDate, endDate] = [`${year}-01-01`, `${year}-12-31`]
      const items = await this.getAllPageItems<HLY_Reimbursement>(async (pageParams) => {
        const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.ContractDataSearch))
        request.setBodyData({
          setOfBooksCode: setOfBooksCode,
          startDate: startDate,
          endDate: endDate,
          ...pageParams,
        })
        return await request.quickSend<HuilianyiResponse<HLY_Reimbursement[]>>()
      })
      allItems = allItems.concat(items)
    }
    return allItems
  }

  public async getAllPageItems<T>(
    handler: (params: { page: number; size: number }) => Promise<HuilianyiResponse<T[]>>
  ) {
    let items: T[] = []
    let finished = false
    let page = 0
    while (!finished) {
      const pageResult = await handler({
        page: page,
        size: 1000,
      })
      const pageItems = pageResult.data
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
