import { SQLBulkAdder } from '../src'
import * as assert from 'assert'
import { demoDatabase, fetchRecordCount, generateRecords } from './DemoHelper'

describe('SQLBulkAdder', () => {
  it(`Test Normal Insert`, async () => {
    const countBefore = await fetchRecordCount()
    const count = 5
    await generateRecords(count)

    const countAfter = await fetchRecordCount()
    assert.strictEqual(countBefore + count, countAfter)
  })

  it(`Test useUpdateWhenDuplicate`, async () => {
    const count = 5
    await generateRecords(count)

    const countBefore = await fetchRecordCount()
    const feeds = await demoDatabase.query(`SELECT * FROM demo_table ORDER BY uid DESC LIMIT ${count}`)
    const newDataList = feeds.map((feed) => {
      return {
        uid: feed['uid'],
        key1: `Dup K1 - ${Math.random()}`,
        key2: `Dup K2 - ${Math.random()}`,
      }
    })
    {
      const bulkAdder = new SQLBulkAdder(demoDatabase)
      bulkAdder.setTable('demo_table')
      bulkAdder.useUpdateWhenDuplicate()
      bulkAdder.setInsertKeys(['uid', 'key1', 'key2'])
      newDataList.forEach((newData) => {
        bulkAdder.putObject(newData)
      })
      await bulkAdder.execute()
    }
    const countAfter2 = await fetchRecordCount()
    assert.strictEqual(countBefore, countAfter2)

    for (const newData of newDataList) {
      const [newData2] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [newData.uid])
      assert.equal(newData2.uid, newData.uid)
      assert.equal(newData2.key1, newData.key1)
      assert.equal(newData2.key2, newData.key2)
    }
  })

  it(`Test keepOldDataWhenDuplicate`, async () => {
    const count = 5
    await generateRecords(count)

    const countBefore = await fetchRecordCount()
    const feeds = await demoDatabase.query(`SELECT * FROM demo_table ORDER BY uid DESC LIMIT ${count}`)
    {
      const bulkAdder = new SQLBulkAdder(demoDatabase)
      bulkAdder.setTable('demo_table')
      bulkAdder.setFixedKey('uid')
      bulkAdder.keepOldDataWhenDuplicate()
      bulkAdder.setInsertKeys(['uid', 'key1', 'key2'])
      feeds.forEach((feed) => {
        const data = Object.assign({}, feed, {
          key1: `Dup K1 - ${Math.random()}`,
          key2: `Dup K2 - ${Math.random()}`,
        })
        bulkAdder.putObject(data)
      })
      await bulkAdder.execute()
    }
    const countAfter2 = await fetchRecordCount()
    assert.strictEqual(countBefore, countAfter2)

    for (const feed of feeds) {
      const [newData2] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [feed.uid])
      assert.equal(newData2.uid, feed.uid)
      assert.equal(newData2.key1, feed.key1)
      assert.equal(newData2.key2, feed.key2)
    }
  })

  it(`Test setMissingValue`, async () => {
    const countBefore = await fetchRecordCount()
    const count = 5
    const bulkAdder = new SQLBulkAdder(demoDatabase)
    bulkAdder.setTable('demo_table')
    bulkAdder.setInsertKeys(['key1', 'key2'])
    bulkAdder.setMissingValue('missing')
    for (let i = 0; i < count; ++i) {
      bulkAdder.putObject({
        key1: `Bulk K1 - ${Math.random()}`,
      })
    }
    await bulkAdder.execute()
    const countAfter = await fetchRecordCount()
    assert.ok(countBefore + count === countAfter)
  })

  it(`Test declareTimestampKey`, async () => {
    const countBefore = await fetchRecordCount()
    const count = 5
    const bulkAdder = new SQLBulkAdder(demoDatabase)
    bulkAdder.setTable('demo_table')
    bulkAdder.setInsertKeys(['key1', 'key2', 'create_time'])
    bulkAdder.declareTimestampKey('create_time')
    for (let i = 0; i < count; ++i) {
      bulkAdder.putObject({
        key1: `Bulk K1 - ${Math.random()}`,
        key2: `Bulk K2 - ${Math.random()}`,
        create_time: new Date('2011-01-01'),
      })
    }
    await bulkAdder.execute()
    const countAfter = await fetchRecordCount()
    assert.ok(countBefore + count === countAfter)
  })

  it(`Test retain key`, async () => {
    const count = 5
    const bulkAdder = new SQLBulkAdder(demoDatabase)
    bulkAdder.setTable('demo_table_3')
    bulkAdder.setInsertKeys(['key1', 'key', 'create_time'])
    bulkAdder.declareTimestampKey('create_time')
    bulkAdder.useUpdateWhenDuplicate()
    for (let i = 0; i < count; ++i) {
      bulkAdder.putObject({
        key1: `Bulk K1 - ${Math.random()}`,
        key: `Bulk K2 - ${Math.random()}`,
        create_time: new Date('2011-01-01'),
      })
    }
    await bulkAdder.execute()
  })
})
