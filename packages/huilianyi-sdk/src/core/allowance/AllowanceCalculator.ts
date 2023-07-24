import { AllowanceMatchResult, App_AllowanceRuleModel } from './App_AllowanceModels'
import { App_MatchType } from './App_MatchType'

export class AllowanceCalculator {
  public rules: App_AllowanceRuleModel[]

  constructor(rules: App_AllowanceRuleModel[]) {
    this.rules = rules
  }

  public calculateResult(roleCode: string, cityName: string) {
    const result: AllowanceMatchResult = {
      unitPrice: 0,
      matchedRules: this.rules.filter((rule) => {
        const roleMatches =
          (rule.roleMatchType === App_MatchType.Including && rule.roleList.includes(roleCode)) ||
          (rule.roleMatchType === App_MatchType.Excluding && !rule.roleList.includes(roleCode))
        const cityMatches =
          (rule.cityMatchType === App_MatchType.Including && rule.cityList.includes(cityName)) ||
          (rule.cityMatchType === App_MatchType.Excluding && !rule.cityList.includes(cityName))
        return roleMatches && cityMatches
      }),
    }
    if (result.matchedRules.length > 0) {
      result.unitPrice = Math.min(...result.matchedRules.map((item) => item.amount))
    }
    return result
  }
}
