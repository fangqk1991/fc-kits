import { HLY_ExpenseV2 } from '../core/HLY_ReimbursementModels'
import { App_ExpenseModel } from '../core/App_CoreModels'
import * as moment from 'moment/moment'

export class HuilianyiFormatter {
  public static transferExpenseModel(item: HLY_ExpenseV2): App_ExpenseModel {
    const expenseFieldVOList = item.expenseFieldVOList || []
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
        customProps: item.customFormValueVOList.reduce((result, cur) => {
          result[cur.fieldCode] = {
            fieldName: cur.fieldName,
            value: cur.value,
            showValue: cur.showValue || cur.value,
          }
          return result
        }, {}),
        customFormValueVOList: item.customFormValueVOList,
        invoiceVOList: item.invoiceVOList,
        expenseProps: expenseFieldVOList.reduce((result, cur) => {
          result[cur.fieldOID] = {
            name: cur.name,
            fieldType: cur.fieldType,
            value: cur.value,
            showValue: cur.showValue,
          }
          return result
        }, {}),
        expenseFieldVOList: expenseFieldVOList,
      },
    }
  }
}
