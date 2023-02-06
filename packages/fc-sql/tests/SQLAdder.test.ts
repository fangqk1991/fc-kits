import { SQLAdder } from '../src'
import * as assert from 'assert'
import { demoDatabase, fetchRecordCount, generateRecords } from './DemoHelper'
import * as moment from 'moment'

describe('Test SQLAdder', () => {
  it(`Test Normal`, async () => {
    const count = 5
    await generateRecords(count)
    const countBefore = await fetchRecordCount()
    for (let i = 0; i < count; ++i) {
      const data = {
        uid: 0,
        key1: `K1 - ${Math.random()}`,
        key2: `K2 - ${Math.random()}`,
      }
      const adder = new SQLAdder(demoDatabase)
      adder.setTable('demo_table')
      adder.insertKV('key1', data.key1)
      adder.insertKV('key2', data.key2)
      data.uid = await adder.execute()
      console.warn(`Last Insert ID: ${data.uid}`)
      const [newData] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [data.uid])
      assert.equal(data.uid, newData.uid)
      assert.equal(data.key1, newData.key1)
      assert.equal(data.key2, newData.key2)
    }
    const countAfter = await fetchRecordCount()
    assert.equal(countBefore + count, countAfter)
  })

  it(`Test useUpdateWhenDuplicate`, async () => {
    const count = 5
    await generateRecords(count)
    const countBefore = await fetchRecordCount()
    const feeds = await demoDatabase.query(`SELECT * FROM demo_table ORDER BY uid DESC LIMIT ${count}`)
    for (const feed of feeds) {
      const newKey1 = `K1 - ${Math.random()}`
      const newKey2 = `K2 - ${Math.random()}`
      const lastInsertId = await new SQLAdder(demoDatabase)
        .setTable('demo_table')
        .useUpdateWhenDuplicate()
        .insertKV('uid', feed.uid)
        .insertKV('key1', newKey1)
        .insertKV('key2', newKey2)
        .execute()

      assert.equal(lastInsertId, 0)
      const [newData2] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [feed.uid])
      assert.equal(newData2.uid, feed.uid)
      assert.equal(newData2.key1, newKey1)
      assert.equal(newData2.key2, newKey2)
    }
    const countAfter = await fetchRecordCount()
    assert.equal(countBefore, countAfter)
  })

  it(`Test keepOldDataWhenDuplicate`, async () => {
    const count = 5
    await generateRecords(count)
    const countBefore = await fetchRecordCount()
    const feeds = await demoDatabase.query(`SELECT * FROM demo_table ORDER BY uid DESC LIMIT ${count}`)
    for (const feed of feeds) {
      const newKey1 = `K1 - ${Math.random()}`
      const newKey2 = `K2 - ${Math.random()}`
      const lastInsertId = await new SQLAdder(demoDatabase)
        .setTable('demo_table')
        .setFixedKey('uid')
        .keepOldDataWhenDuplicate()
        .insertKV('uid', feed.uid)
        .insertKV('key1', newKey1)
        .insertKV('key2', newKey2)
        .execute()

      assert.equal(lastInsertId, 0)
      const [newData2] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [feed.uid])
      assert.equal(newData2.uid, feed.uid)
      assert.equal(newData2.key1, feed.key1)
      assert.equal(newData2.key2, feed.key2)
    }
    const countAfter = await fetchRecordCount()
    assert.equal(countBefore, countAfter)
  })

  it(`Test insert timestamp`, async () => {
    const createTime = new Date('2011-01-01')
    {
      const sql = `INSERT INTO demo_table(key1, key2, create_time) VALUES (?, ?, FROM_UNIXTIME(?))`
      await demoDatabase.update(sql, [`K1 - ${Math.random()}`, `K2 - ${Math.random()}`, moment(createTime).unix()])
      const [{ lastInsertId }] = (await demoDatabase.query('SELECT LAST_INSERT_ID() AS lastInsertId', [])) as any
      const [newData] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [lastInsertId])
      assert.equal(moment(createTime).valueOf(), moment(newData['create_time']).valueOf())
    }
    {
      const adder = new SQLAdder(demoDatabase)
      adder.setTable('demo_table')
      adder.insertKV('key1', `K1 - ${Math.random()}`)
      adder.insertKV('key2', `K2 - ${Math.random()}`)
      adder.insertKVForTimestamp('create_time', createTime)
      const uid = await adder.execute()
      const [{ create_time: createTime2 }] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [uid])
      assert.equal(moment(createTime).valueOf(), moment(createTime2).valueOf())
    }
  })

  // it(`Test insert timestamp [fail]`, async () => {
  //   const data = {
  //     uid: 0,
  //     key1: `K1 - ${Math.random()}`,
  //     key2: `K2 - ${Math.random()}`,
  //     createTime: new Date('2011-01-01'),
  //   }
  //   const adder = new SQLAdder(demoDatabase)
  //   adder.setTable('demo_table')
  //   adder.insertKV('key1', data.key1)
  //   adder.insertKV('key2', data.key2)
  //   adder.insertKV('create_time', data.createTime as any)
  //   data.uid = await adder.execute()
  //   logger.warn(`Last Insert ID: ${data.uid}`)
  //   const [newData] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [data.uid])
  //   logger.info(data, newData)
  //   logger.info(moment(data.createTime).format(), newData['create_time'])
  //   assert.equal(data.uid, newData.uid)
  //   assert.equal(data.key1, newData.key1)
  //   assert.equal(data.key2, newData.key2)
  //   assert.equal(moment(data.createTime).valueOf(), moment(newData['create_time']).valueOf())
  // })
})
