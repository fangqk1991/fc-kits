import {
  AllowanceCoreTicket,
  AllowanceDayItem,
  AllowanceUnitPriceInfo,
  App_AllowanceRuleModel,
  CityStayItem,
} from './App_AllowanceModels'
import { App_MatchType } from './App_MatchType'
import { App_TicketsFragment } from '../travel/App_TravelModels'
import { TimeUtils } from '../tools/TimeUtils'
import { HLY_StaffAllowanceStatus } from '../travel/HLY_StaffAllowanceStatus'

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

  private reduceCoreTickets(tickets: AllowanceCoreTicket[]) {
    if (tickets.length === 0) {
      return []
    }
    tickets = tickets.map((ticket) => ({
      fromCity: ticket.fromCity,
      toCity: ticket.toCity,
      fromTime: ticket.fromTime,
      toTime: ticket.toTime,
      baseCity: ticket.baseCity,
    }))
    const targetTickets: AllowanceCoreTicket[] = [tickets[0]]
    for (let i = 1; i < tickets.length; ++i) {
      const lastTicket = targetTickets[targetTickets.length - 1]
      const curTicket = tickets[i]
      if (
        (lastTicket.fromCity !== lastTicket.baseCity || curTicket.toCity !== curTicket.baseCity) &&
        TimeUtils.momentUTC8(curTicket.fromTime).unix() - TimeUtils.momentUTC8(lastTicket.toTime).unix() < 3600 * 4
      ) {
        lastTicket.toCity = curTicket.toCity
        lastTicket.toTime = curTicket.toTime
        continue
      }
      targetTickets.push(curTicket)
    }
    return targetTickets
  }

  public calculateAllowanceDayItems(
    staffProps: {
      roleCodeList: string[]
      withoutAllowance?: HLY_StaffAllowanceStatus
    },
    loopItems: App_TicketsFragment[]
  ): AllowanceDayItem[] {
    const allDayItems: AllowanceDayItem[] = []
    for (const closedLoop of loopItems) {
      const logicTickets = this.reduceCoreTickets(closedLoop.tickets)
      // 最后一段行程按出发地，其他均按目的地
      const firstTicket = logicTickets[0]
      const lastTicket = logicTickets[logicTickets.length - 1]
      let curDate = TimeUtils.momentUTC8(firstTicket.fromTime).startOf('day')
      const ruleResult = this.calculateRules(staffProps.roleCodeList, firstTicket.toCity)
      const dayItems: AllowanceDayItem[] = [
        {
          date: curDate.format('YYYY-MM-DD'),
          cityName: firstTicket.toCity,
          amount: firstTicket.toCity === firstTicket.baseCity ? 0 : ruleResult.unitPrice,
          halfDay: false,
        },
      ]
      for (let i = 1; i < logicTickets.length; ++i) {
        const ticket = logicTickets[i]

        const lastCity = ticket.fromCity
        const ruleResult = this.calculateRules(staffProps.roleCodeList, lastCity)

        while (curDate.valueOf() < TimeUtils.momentUTC8(ticket.toTime).startOf('day').valueOf()) {
          curDate.add(1, 'day')
          dayItems.push({
            date: curDate.format('YYYY-MM-DD'),
            cityName: lastCity,
            amount: ticket.baseCity === lastCity ? 0 : ruleResult.unitPrice,
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
      //   logicTickets.map((item) => `${item.fromTime} ~ ${item.toTime} | ${item.fromCity} -> ${item.toCity}`)
      // )
      // console.info('--- END ---')
      // for (const ticket of logicTickets) {
      //   console.info(TimeUtils.momentUTC8(ticket.fromTime), ticket.fromTime, ticket.toTime)
      // }
    }

    if (staffProps.withoutAllowance === HLY_StaffAllowanceStatus.WithoutAllowance) {
      allDayItems.forEach((item) => (item.amount = 0))
    }
    return allDayItems
  }

  public calculateCityStayItems(tickets: AllowanceCoreTicket[]): CityStayItem[] {
    if (tickets.length === 0) {
      return []
    }
    const logicTickets = this.reduceCoreTickets(tickets)
    const stayItems: CityStayItem[] = []
    const baseCity = logicTickets[0].baseCity

    {
      const ticket = logicTickets[0]
      stayItems.push({
        cityName: ticket.toCity,
        fromTime: ticket.fromTime,
        toTime: ticket.toTime,
      })
    }

    for (let i = 1; i < logicTickets.length; ++i) {
      const prevTicket = logicTickets[i - 1]
      const ticket = logicTickets[i]
      const lastStay = stayItems[stayItems.length - 1]

      if (prevTicket.toCity === ticket.fromCity) {
        lastStay.toTime = ticket.fromTime
        lastStay.isVerified = true
      }
      const newStayItem: CityStayItem = {
        cityName: ticket.toCity,
        fromTime: ticket.fromTime,
        toTime: ticket.toTime,
      }
      stayItems.push(newStayItem)

      if (ticket.toCity === baseCity) {
        lastStay.toTime = ticket.toTime
        newStayItem.fromTime = ticket.toTime
      }
    }
    return stayItems.filter((item) => item.cityName !== baseCity)
  }
}
