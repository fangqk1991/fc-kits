import { HuilianyiFormatter } from '../../src/client/HuilianyiFormatter'

describe('Test HuilianyiFormatter.test.ts', () => {
  it(`extractMonthList`, async () => {
    console.info(HuilianyiFormatter.extractMonthList('2022-01-02', '2022-01-03'))
    console.info(HuilianyiFormatter.extractMonthList('2022-01-02', '2022-02-03'))
    console.info(HuilianyiFormatter.extractMonthList('2021-01-02', '2022-02-03'))
    console.info(HuilianyiFormatter.extractMonthList('2023-01-31T16:00:00+00:00', '2023-02-03'))
  })
})
