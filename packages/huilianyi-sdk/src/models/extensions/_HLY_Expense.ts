import __HLY_Expense from '../auto-build/__HLY_Expense'
import { HLY_CustomFormValue } from '../../core/HLY_CoreModels'
import { ExpenseFieldDTO, ExpenseReportInvoiceView } from '../../core/HLY_ReimbursementModels'

export class _HLY_Expense extends __HLY_Expense {
  public constructor() {
    super()
  }

  public extrasData(): {
    customFormValueVOList: HLY_CustomFormValue[]
    invoiceVOList: ExpenseReportInvoiceView[]
    expenseFieldVOList: ExpenseFieldDTO[]
  } {
    const defaultData = {
      customFormValueVOList: [],
      invoiceVOList: [],
      expenseFieldVOList: [],
    }
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public modelForClient() {
    const data = this.fc_pureModel() as any
    data.extrasData = this.extrasData()
    delete data.extrasInfo
    return data
  }
}
