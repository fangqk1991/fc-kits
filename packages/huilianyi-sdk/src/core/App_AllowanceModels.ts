import { App_MatchType } from './App_MatchType'

export interface App_AllowanceRuleModel {
  roleMatchType: App_MatchType
  roleList: string[]
  cityMatchType: App_MatchType
  cityList: string[]
  amount: number
}
