import { FCDatabase, SQLRemover, SQLSearcher } from '../src'
import * as assert from 'assert'
import { demoDatabase, fetchRecordCount, generateRecords, getOneRecord } from './DemoHelper'

describe('Test SQL', () => {
  it(`Test FCDatabase`, async () => {
    FCDatabase.instanceWithName('xx')
    FCDatabase.getInstance()

    await demoDatabase.ping()
    await demoDatabase.update('DELETE FROM demo_table')

    {
      const items = await demoDatabase.query('SELECT * FROM demo_table')
      assert.ok(Array.isArray(items) && items.length === 0)
    }

    await demoDatabase.update('INSERT INTO demo_table(key1, key2) VALUES(?, ?)', ['K1', 'K2'])
    await demoDatabase.update('INSERT INTO demo_table(key1, key2) VALUES(?, ?)', ['K100', 'K2'])

    {
      const items = await demoDatabase.query('SELECT * FROM demo_table')
      assert.ok(Array.isArray(items) && items.length === 2)
      assert.ok(items[0]['key1'] === 'K1' && items[0]['key2'] === 'K2')
      assert.ok(items[1]['key1'] === 'K100' && items[1]['key2'] === 'K2')
    }

    await demoDatabase.update('UPDATE demo_table SET key2 = ? WHERE key1 = ?', ['K2-Changed', 'K1'])

    {
      const items = await demoDatabase.query('SELECT * FROM demo_table')
      assert.ok(Array.isArray(items) && items.length === 2)
      assert.ok(items[0]['key1'] === 'K1' && items[0]['key2'] === 'K2-Changed')
      assert.ok(items[1]['key1'] === 'K100' && items[1]['key2'] === 'K2')
    }

    await demoDatabase.update('DELETE FROM demo_table WHERE key1 = ?', ['K100'])

    {
      const items = await demoDatabase.query('SELECT * FROM demo_table')
      assert.ok(Array.isArray(items) && items.length === 1)
      assert.ok(items[0]['key1'] === 'K1' && items[0]['key2'] === 'K2-Changed')
    }

    await demoDatabase.update('DELETE FROM demo_table WHERE key1 = ?', ['K1'])

    {
      const items = await demoDatabase.query('SELECT * FROM demo_table')
      assert.ok(Array.isArray(items) && items.length === 0)
    }
  })

  it(`Test SQLRemover`, async () => {
    await generateRecords(5)

    const countBefore = await fetchRecordCount()
    const count = Math.floor(countBefore / 2)
    for (let i = 0; i < count; ++i) {
      const dataBefore: any = await getOneRecord()
      const remover = new SQLRemover(demoDatabase)
      remover.setTable('demo_table')
      remover.addConditionKV('uid', dataBefore['uid'])
      await remover.execute()

      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns(['uid', 'key1', 'key2'])
      searcher.addConditionKV('uid', dataBefore['uid'])
      assert.ok((await searcher.queryCount()) === 0)
    }

    const countAfter = await fetchRecordCount()
    assert.ok(countBefore - count === countAfter)
  })

  it(`Test SQLSearcher`, async () => {
    {
      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns(['uid', 'key1', 'key2'])
      const count = await searcher.queryCount()
      const items = await searcher.queryList()
      assert.ok(Array.isArray(items))
      assert.ok(items.length === count)
    }
    {
      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns([
        'demo_table.uid AS uid',
        'demo_table.key1 AS key1',
        'demo_table.key2 AS key2',
        'CONCAT(demo_table.key1, demo_table.key2) AS full_name',
      ])
      const count = await searcher.queryCount()
      const items = await searcher.queryList()
      assert.ok(Array.isArray(items))
      assert.ok(items.length === count)
    }
    {
      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns(['*'])
      searcher.addOrderRule('IF(uid > ?, 1000, 0)', 'DESC', 16)
      const count = await searcher.queryCount()
      const items = await searcher.queryList()
      assert.ok(Array.isArray(items))
      assert.ok(items.length === count)
    }
    {
      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns(['*'])
      searcher.addConditionKeyInSet('uid')
      const count = await searcher.queryCount()
      assert.strictEqual(count, 0)
    }
    {
      await generateRecords(5)

      const searcher = new SQLSearcher(demoDatabase)
      searcher.setTable('demo_table')
      searcher.setColumns(['*'])
      searcher.setPageInfo(0, 5)
      const items = await searcher.queryList()
      const uidList = items.map((item) => item['uid'])

      {
        const searcher = new SQLSearcher(demoDatabase)
        searcher.setTable('demo_table')
        searcher.setColumns(['*'])
        searcher.addConditionKeyInSet('uid', ...uidList)
        const items = await searcher.queryList()
        assert.strictEqual(items.length, uidList.length)
        items.forEach((item) => {
          assert.ok(uidList.includes(item['uid']))
        })
      }
    }
  })

  it(`Test _columnsDesc`, async () => {
    const searcher = new SQLSearcher(demoDatabase)
    searcher.setTable('demo_table')
    searcher.setColumns(['uid AS `a uid`'])
    await searcher.queryList()
  })

  it(`Test setOptionStr`, async () => {
    const searcher = new SQLSearcher(demoDatabase)
    searcher.setTable('demo_table')
    searcher.setColumns(['MOD(uid, 10) AS unit', 'COUNT(*) AS count'])
    searcher.setOptionStr('GROUP BY unit HAVING count > ? AND unit >= ?', 0, 5)
    searcher.addOrderRule('IF(MOD(unit, ?) = 0, 0, 1)', 'ASC', 2)
    searcher.addOrderRule('unit', 'ASC')
    const items = await searcher.queryList()
    assert.ok(items.length <= 5)
  })

  it(`Test addSpecialCondition`, async () => {
    const items = Array(100000).fill(1)
    const searcher = new SQLSearcher(demoDatabase)
    searcher.addConditionKeyInSet('xxxx', ...items)
  })

  it(`Test transaction limit`, async () => {
    for (let i = 0; i < 1000; ++i) {
      const transaction = await demoDatabase._db().transaction()
      // 必须 commit 或 rollback
      await transaction.commit()
    }
    for (let i = 0; i < 1000; ++i) {
      const transaction = await demoDatabase._db().transaction()
      // 必须 commit 或 rollback
      await transaction.rollback()
    }
  })

  it(`Test getTables`, async () => {
    console.info(await demoDatabase.getTables())
  })
})
