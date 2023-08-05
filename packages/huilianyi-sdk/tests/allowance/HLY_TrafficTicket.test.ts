import { HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'
import { HuilianyiService } from '../../src/HuilianyiService'

describe('Test HLY_AllowanceRule.test.ts', () => {
  const huilianyiService = new HuilianyiService({
    authConfig: HuilianyiConfigTest,
    database: HuilianyiDBTest,
  })

  it(`HLY_TrafficTicket`, async () => {
    const pageResult = await huilianyiService.modelsCore.HLY_TrafficTicket.getPageResult({
      _sortKey: 'userName',
      _sortDirection: 'ASC',
    })
    console.info(JSON.stringify(pageResult.items, null, 2))
  })

  it(`userTicketReporters`, async () => {
    const userTicketReporters = await huilianyiService.modelsCore.HLY_TrafficTicket.userTicketReporters()
    console.info(JSON.stringify(userTicketReporters, null, 2))
  })

  it(`HLY_TrafficTicket groupBy`, async () => {
    const searcher = new huilianyiService.modelsCore.HLY_TrafficTicket().fc_searcher()
    searcher
      .processor()
      .setColumns([
        'user_oid AS userOid',
        'user_name AS userName',
        'COUNT(*) AS count',
        'COUNT(IF(is_valid = 1, 1, NULL)) AS validCount',
        'COUNT(IF(is_valid = 0, 1, NULL)) AS invalidCount',
      ])
    searcher.processor().setGroupByKeys(['userOid', 'userName'])
    searcher.processor().addOrderRule('CONVERT(user_name USING gbk)', 'ASC')
    const items = await searcher.processor().queryList()
    console.info(JSON.stringify(items, null, 2))
  })
})
