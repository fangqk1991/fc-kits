import { SQLModifier, SQLSearcher } from '../src'
import * as assert from 'assert'
import { demoDatabase, generateRecords } from './DemoHelper'

describe('Test SQLSearcher.test.ts', () => {
  it(`Test groupBy`, async () => {
    await generateRecords(10)
    {
      const modifier = new SQLModifier(demoDatabase)
      modifier.setTable('demo_table')
      modifier.updateKV('key1', `K1`)
      modifier.addSpecialCondition('MOD(uid, 3) = 0')
      await modifier.execute()
    }
    const searcher = new SQLSearcher(demoDatabase)
    searcher.setTable('demo_table')
    searcher.setColumns(['key1', 'COUNT(*) AS count'])
    searcher.setGroupByKeys(['key1'])
    searcher.setOptionStr('HAVING count > ?', 1)
    searcher.addOrderRule('count', 'DESC')
    const items = await searcher.queryList()
    console.info(JSON.stringify(items, null, 2))
    assert.ok(true)
  })
})
