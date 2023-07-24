import { HLY_CustomFormValue } from './HLY_CoreModels'

/**
 * https://opendocs.huilianyi.com/implement/master-data/department/select-department.html
 */
export interface HLY_SimpleDepartment {
  departmentOID: string
  departmentName: string
  departmentPath: string
  managerName: string
  managerOID: string
  status: number // 101--启用;102--禁用;103--删除
  departmentParentOID: string
  customFormValues: HLY_CustomFormValue[]
  departmentType: string
}
