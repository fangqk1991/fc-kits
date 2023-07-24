/**
 * @description https://opendocs.huilianyi.com/callback/business-data/widget/out_form_calculate.html
 */
export interface HLY_CustomFormRequestDTO {
  formCode: string // 表单 code
  currentEmployeeID: string // 当前人工号
  applicantEmployeeID: string // 申请人工号
  fieldCode?: string // ?
  currentFieldCode: string // 当前点击配置了系统计算回调的控件 code，控件属性 fieldConstraint 字段, valueMode=1003 为系统计算回调配置
  customFormValueList: HLY_CustomFormItem[] // 表单控件值
}

export interface HLY_CustomFormItem {
  fieldCode: string // 控件 code
  fieldName: string
  value: string // 控件值
  showValue: string // 控件值显示值
  valueCode?: string // 控件 valueCode, 如果该控件有 valueCode 值
}

export interface HLY_CustomFormResponseItem {
  fieldCode: string // 控件 code
  value?: string // 控件值，如果控件值有valueCode，value 以 valueCode 值返回
  valueCode?: string
}
