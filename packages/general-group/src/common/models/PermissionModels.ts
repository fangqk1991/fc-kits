import { CommonPermissionModel } from './auto-build'

export interface ScopeProfile {
  scope: string
  permissions: CommonPermissionModel[]
}

export interface ScopeParams {
  [p: string]: string[]
}
