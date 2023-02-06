import { SQLModifier, SQLSearcher } from '../src'
import * as assert from 'assert'
import { demoDatabase, generateRecords, getOneRecord } from './DemoHelper'
import * as moment from 'moment'

describe('Test SQLModifier', () => {
  it(`Test Normal`, async () => {
    await generateRecords(1)
    const dataBefore: any = await getOneRecord()
    const modifier = new SQLModifier(demoDatabase)
    modifier.setTable('demo_table')
    modifier.updateKV('key1', `K1 - Changed`)
    modifier.updateKV('key2', `K2 - Changed`)
    modifier.addConditionKV('uid', dataBefore['uid'])
    await modifier.execute()

    const searcher = new SQLSearcher(demoDatabase)
    searcher.setTable('demo_table')
    searcher.setColumns(['uid', 'key1', 'key2'])
    searcher.addConditionKV('uid', dataBefore['uid'])
    const dataAfter: any = await searcher.querySingle()
    assert.ok(dataAfter['key1'] === `K1 - Changed`)
    assert.ok(dataAfter['key2'] === `K2 - Changed`)
  })

  it(`Test updateExpression`, async () => {
    await generateRecords(1)
    const dataBefore: any = await getOneRecord()
    const modifier = new SQLModifier(demoDatabase)
    modifier.setTable('demo_table')
    modifier.updateExpression('key1 = ?', `K1 - Changed`)
    modifier.updateExpression('key2 = ?', `K2 - Changed`)
    modifier.addConditionKV('uid', dataBefore['uid'])
    await modifier.execute()

    const searcher = new SQLSearcher(demoDatabase)
    searcher.setTable('demo_table')
    searcher.setColumns(['uid', 'key1', 'key2'])
    searcher.addConditionKV('uid', dataBefore['uid'])
    const dataAfter: any = await searcher.querySingle()
    assert.ok(dataAfter['key1'] === `K1 - Changed`)
    assert.ok(dataAfter['key2'] === `K2 - Changed`)
  })

  it(`Test modify timestamp`, async () => {
    await generateRecords(1)
    const dataBefore: any = await getOneRecord()
    {
      const createTime = new Date('2011-01-01')
      const modifier = new SQLModifier(demoDatabase)
      modifier.setTable('demo_table')
      modifier.updateKVForTimestamp('create_time', createTime)
      modifier.addConditionKV('uid', dataBefore['uid'])
      await modifier.execute()
      const [{ create_time: createTime2 }] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [
        dataBefore.uid,
      ])
      assert.equal(moment(createTime).valueOf(), moment(createTime2).valueOf())
    }
    {
      const createTime = new Date('2011-01-05')
      const modifier = new SQLModifier(demoDatabase)
      modifier.setTable('demo_table')
      modifier.updateKVForTimestamp('create_time', moment(createTime))
      modifier.addConditionKV('uid', dataBefore['uid'])
      await modifier.execute()
      const [{ create_time: createTime2 }] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [
        dataBefore.uid,
      ])
      assert.equal(moment(createTime).valueOf(), moment(createTime2).valueOf())
    }
    {
      const createTime = new Date('2011-01-10')
      const modifier = new SQLModifier(demoDatabase)
      modifier.setTable('demo_table')
      modifier.updateKVForTimestamp('create_time', moment(createTime).format())
      modifier.addConditionKV('uid', dataBefore['uid'])
      await modifier.execute()
      const [{ create_time: createTime2 }] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [
        dataBefore.uid,
      ])
      assert.equal(moment(createTime).valueOf(), moment(createTime2).valueOf())
    }
    {
      const createTime = new Date('2011-01-20')
      const modifier = new SQLModifier(demoDatabase)
      modifier.setTable('demo_table')
      modifier.updateKVForTimestamp('create_time', moment(createTime).valueOf())
      modifier.addConditionKV('uid', dataBefore['uid'])
      await modifier.execute()
      const [{ create_time: createTime2 }] = await demoDatabase.query('SELECT * FROM demo_table WHERE uid = ?', [
        dataBefore.uid,
      ])
      assert.equal(moment(createTime).valueOf(), moment(createTime2).valueOf())
    }
  })
})
