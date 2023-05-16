export interface HuilianyiResponse<T> {
  message: string
  errorCode: string
  data: T
}

export interface HLY_CustomField {
  fieldCode: string
  fieldName: string
  value: string
}

export interface HLY_Company {
  code: string
  name: string
  parentCompanyCode: string | null
  parentCompanyName: string | null
  legalEntityOID: string
  legalEntityName: string
  customFormValues: HLY_CustomField[] | null
  isEnabled: boolean
}
