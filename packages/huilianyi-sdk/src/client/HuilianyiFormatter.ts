import { HLY_ExpenseV2 } from '../core/HLY_ReimbursementModels'
import { App_ExpenseModel } from '../core/App_CoreModels'
import * as moment from 'moment/moment'

export class HuilianyiFormatter {
  public static transferExpenseModel(item: HLY_ExpenseV2): App_ExpenseModel {
    return {
      hlyId: Number(item.id),
      businessCode: item.businessCode,
      applicationOid: item.applicationOID,
      applicantOid: item.applicantOID,
      applicantName: item.applicantName,
      companyOid: item.companyOID,
      departmentOid: item.departmentOID,
      corporationOid: item.corporationOID,
      formOid: item.formOID,
      formName: item.formName,
      submittedBy: item.submittedBy,
      title: item.title,
      expenseType: item.type,
      expenseStatus: item.status,
      totalAmount: item.totalAmount,
      createdDate: item.createdDate ? moment(item.createdDate).format() : null,
      firstSubmittedDate: item.firstSubmittedDate ? moment(item.firstSubmittedDate).format() : null,
      lastSubmittedDate: item.lastSubmittedDate ? moment(item.lastSubmittedDate).format() : null,
      lastModifiedDate: item.lastModifiedDate ? moment(item.lastModifiedDate).format() : null,
      extrasData: {
        customFormValueVOList: item.customFormValueVOList,
        invoiceVOList: item.invoiceVOList,
        expenseFieldVOList: item.expenseFieldVOList,
      },
    }
  }
}
