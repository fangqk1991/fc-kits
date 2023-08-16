import { AllowanceDayItem, AllowanceUnitPriceInfo, App_AllowanceRuleModel } from './App_AllowanceModels'
import { App_MatchType } from './App_MatchType'
import { App_ClosedLoop } from '../travel/App_TravelModels'
import { TimeUtils } from '../tools/TimeUtils'

export class AllowanceCalculator {
  public rules: App_AllowanceRuleModel[]

  constructor(rules: App_AllowanceRuleModel[]) {
    this.rules = rules
  }

  public calculateRules(roleCodeList: string[], cityName: string) {
    const result: AllowanceUnitPriceInfo = {
      unitPrice: 0,
      matchedRules: this.rules.filter((rule) => {
        const roleMatches =
          (rule.roleMatchType === App_MatchType.Including &&
            !!roleCodeList.find((role) => rule.roleList.includes(role))) ||
          (rule.roleMatchType === App_MatchType.Excluding && !roleCodeList.find((role) => rule.roleList.includes(role)))
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

  public calculateAllowanceDayItems(roleCodeList: string[], loopItems: App_ClosedLoop[]): AllowanceDayItem[] {
    const allDayItems: AllowanceDayItem[] = []
    for (const closedLoop of loopItems) {
      // 最后一段行程按出发地，其他均按目的地
      const firstTicket = closedLoop.tickets[0]
      const lastTicket = closedLoop.tickets[closedLoop.tickets.length - 1]
      let curDate = TimeUtils.momentUTC8(firstTicket.fromTime).startOf('day')
      const ruleResult = this.calculateRules(roleCodeList, firstTicket.toCity)

      const dayItems: AllowanceDayItem[] = [
        {
          date: curDate.format('YYYY-MM-DD'),
          cityName: firstTicket.toCity,
          amount: ruleResult.unitPrice,
          halfDay: false,
        },
      ]
      for (let i = 1; i < closedLoop.tickets.length; ++i) {
        const ticket = closedLoop.tickets[i]
        const baseCity = ticket.baseCity
        const lastCity = ticket.fromCity
        const ruleResult = this.calculateRules(roleCodeList, lastCity)

        while (curDate.valueOf() < TimeUtils.momentUTC8(ticket.toTime).startOf('day').valueOf()) {
          curDate.add(1, 'day')
          dayItems.push({
            date: curDate.format('YYYY-MM-DD'),
            cityName: lastCity,
            amount: baseCity === lastCity ? 0 : ruleResult.unitPrice,
            halfDay: false,
          })
        }
      }
      dayItems[0].halfDay = TimeUtils.momentUTC8(firstTicket.fromTime).hours() >= 12
      if (dayItems[0].halfDay) {
        dayItems[0].amount /= 2
      }
      dayItems[dayItems.length - 1].halfDay = TimeUtils.momentUTC8(lastTicket.toTime).hours() < 12
      if (dayItems[dayItems.length - 1].halfDay) {
        dayItems[dayItems.length - 1].amount /= 2
      }
      allDayItems.push(...dayItems)
      // console.info('--- START ---')
      // console.info(dayItems)
      // console.info(
      //   closedLoop.tickets.map((item) => `${item.fromTime} ~ ${item.toTime} | ${item.fromCity} -> ${item.toCity}`)
      // )
      // console.info('--- END ---')
      // for (const ticket of closedLoop.tickets) {
      //   console.info(TimeUtils.momentUTC8(ticket.fromTime), ticket.fromTime, ticket.toTime)
      // }
    }
    return allDayItems
  }
}
