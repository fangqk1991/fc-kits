import { HuilianyiFormatter } from '../../src/client/HuilianyiFormatter'

describe('Test HuilianyiFormatter.test.ts', () => {
  it(`transferMonthSectionInfos`, async () => {
    const sections = HuilianyiFormatter.transferMonthSectionInfos([
      {
        startDate: '2022-01-02',
        endDate: '2022-01-03',
      },
      {
        startDate: '2022-01-22',
        endDate: '2022-01-23',
      },
      {
        startDate: '2022-01-28',
        endDate: '2022-02-04',
      },
      {
        startDate: '2022-02-10',
        endDate: '2022-02-15',
      },
    ])
    console.info(JSON.stringify(sections, null, 2))
  })

  it(`extractMonthList`, async () => {
    console.info(HuilianyiFormatter.extractMonthList('2022-01-02', '2022-01-03'))
    console.info(HuilianyiFormatter.extractMonthList('2022-01-02', '2022-02-03'))
    console.info(HuilianyiFormatter.extractMonthList('2021-01-02', '2022-02-03'))
    console.info(HuilianyiFormatter.extractMonthList('2023-01-31T16:00:00+00:00', '2023-02-03'))
  })
})
