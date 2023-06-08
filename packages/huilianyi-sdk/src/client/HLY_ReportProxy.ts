import { CommonAPI } from '@fangcha/app-request'
import { HLY_ReportApis } from './HLY_ReportApis'
import { HLY_ExpenseDetail, HLY_TravelApplyForm, HuilianyiResponse } from '../core/HuilianyiModels'
import * as moment from 'moment'
import { HuilianyiProxyBase } from './HuilianyiProxyBase'
import { HLY_ReimbursementReport } from '../core/HLY_ReimbursementModels'

export class HLY_ReportProxy extends HuilianyiProxyBase {
  public async searchReimbursementData() {
    return await this.getAllPageItems(async (pageParams) => {
      const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.Report_ReimbursementDataSearch))
      request.setBodyData({
        ...pageParams,
      })
      return await request.quickSend<HuilianyiResponse<HLY_ReimbursementReport[]>>()
    })
  }

  public async searchExpenseDetailsData() {
    return await this.getAllPageItems(async (pageParams) => {
      const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.ExpenseDetailsDataSearch))
      request.setBodyData({
        ...pageParams,
      })
      return await request.quickSend<HuilianyiResponse<HLY_ExpenseDetail[]>>()
    })
  }

  public async searchTravelApplyData() {
    return await this.getAllPageItems(async (pageParams) => {
      const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.TravelApplyDataSearch))
      request.setBodyData({
        ...pageParams,
      })
      return await request.quickSend<HuilianyiResponse<HLY_TravelApplyForm[]>>()
    })
  }

  public async searchContractData(setOfBooksCode: string) {
    return await this.getAllPageItems(async (pageParams) => {
      const request = await this.makeRequest(new CommonAPI(HLY_ReportApis.ContractDataSearch))
      request.setBodyData({
        setOfBooksCode: setOfBooksCode,
        ...pageParams,
      })
      return await request.quickSend<HuilianyiResponse<any[]>>()
    })
  }

  private async getAllPageItems<T>(
    handler: (params: { page: number; size: number }) => Promise<HuilianyiResponse<T[]>>
  ) {
    let items: T[] = []
    const startYear = 2015
    const endYear = moment().year()
    for (let year = startYear; year <= endYear; ++year) {
      const [startDate, endDate] = [`${year}-01-01`, `${year}-12-31`]
      let finished = false
      let page = 0
      while (!finished) {
        const pageResult = await handler({
          startDate: startDate,
          endDate: endDate,
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
    }
    return items
  }
}
