import { loggerForDev } from '@fangcha/logger/lib'
import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'
import { AllowanceCalculator } from '../../src'
import * as moment from 'moment'

describe('Test AllowanceCalculator.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`AllowanceCalculator`, async () => {
    const rules = await huilianyiService.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    loggerForDev.info(calculator.calculateRules(['01'], '北京'))
    loggerForDev.info(calculator.calculateRules(['NULL'], '北京'))
  })

  it(`calculateAllowanceDayItems`, async () => {
    const searcher = await new huilianyiService.modelsCore.HLY_TravelAllowance().fc_searcher()
    searcher.processor().addConditionKV('is_pretty', 1)
    const feeds = await searcher.queryAllFeeds()

    const rules = await huilianyiService.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    for (const feed of feeds) {
      const staff = (await huilianyiService.modelsCore.HLY_Staff.findWithUid(feed.applicantOid!))!
      const dayItems = calculator.calculateAllowanceDayItems(staff.groupCodes(), feed.extrasData().closedLoops)
      // console.info(JSON.stringify(dayItems, null, 2))

      console.info('--- START ---')
      console.info(staff.fullName, staff.groupCodes(), dayItems)
      // console.info(
      //   closedLoop.tickets.map((item) => `${item.fromTime} ~ ${item.toTime} | ${item.fromCity} -> ${item.toCity}`)
      // )
      console.info('--- END ---')
    }
  })

  it(`calculateAllowanceDayItems - 2`, async () => {
    const rules = await huilianyiService.modelsCore.HLY_AllowanceRule.allRules()
    const calculator = new AllowanceCalculator(rules)
    const dayItems = calculator.calculateAllowanceDayItems(
      [],
      [
        {
          tickets: [
            {
              tagName: '机票',
              ticketId: '',
              trafficCode: '',
              fromTime: '2023-07-05 20:10:00',
              toTime: '2023-07-05 22:40:00',
              fromCity: '上海',
              toCity: '珠海',
              employeeId: '',
              employeeName: '',
            },
            {
              tagName: '机票',
              ticketId: '',
              trafficCode: '',
              fromTime: '2023-07-07 16:50:00',
              toTime: '2023-07-07 19:05:00',
              fromCity: '珠海',
              toCity: '广州',
              employeeId: '',
              employeeName: '',
            },
            {
              tagName: '机票',
              ticketId: '',
              trafficCode: '',
              fromTime: '2023-07-11 16:50:00',
              toTime: '2023-07-11 19:05:00',
              fromCity: '广州',
              toCity: '上海',
              employeeId: '',
              employeeName: '',
            },
          ],
        },
      ]
    )
  })

  it(`moments`, async () => {
    console.info(moment().utcOffset('+01:00').format())
    console.info(moment().utcOffset('+01:00', true).format())
  })
})
