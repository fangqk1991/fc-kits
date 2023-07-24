import { App_MatchType } from './App_MatchType'

export interface App_AllowanceRuleModel {
  roleMatchType: App_MatchType
  roleList: string[]
  cityMatchType: App_MatchType
  cityList: string[]
  amount: number
}

export interface AllowanceUnitPriceInfo {
  unitPrice: number
  matchedRules: App_AllowanceRuleModel[]
}

export interface AllowanceDayItem {
  date: string
  factor: number // 1 or 0.5
  cityName: string
  amount: number
}
