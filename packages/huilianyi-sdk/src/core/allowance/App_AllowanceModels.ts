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
  cityName: string
  amount: number
  halfDay?: boolean
}

export interface AllowanceSnapshotLogModel {
  targetMonth: string
  recordCount: number
  version: number
  createTime: string
  updateTime: string
}
