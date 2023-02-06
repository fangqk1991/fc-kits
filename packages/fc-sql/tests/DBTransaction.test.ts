import { FCDatabase, NextAction, SQLAdder, SQLModifier, SQLRemover, SQLSearcher } from '../src'
import * as assert from 'assert'
import { Transaction } from 'sequelize'

const database = FCDatabase.getInstance()
database.init({
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  database: 'demo_db',
  username: 'root',
  password: '',
  timezone: '+00:00',
  // logging: false,
})

const globalSearcher = new SQLSearcher(database)
globalSearcher.setTable('demo_table_2')
globalSearcher.setColumns(['*'])

const clearRecords = async () => {
  await database.update('TRUNCATE demo_table_2')
}

const buildSomeRecords = async (count: number) => {
  for (let i = 0; i < count; ++i) {
    const adder = new SQLAdder(database)
    adder.setTable('demo_table_2')
    adder.insertKV('key1', `K1 - ${Math.random()}`)
    adder.insertKV('key2', `K2 - ${Math.random()}`)
    await adder.execute()
  }
}

describe('Test TransactionRunner', () => {
  it(`Test Rollback`, async () => {
    await clearRecords()
    const count = 5
    const errorMessage = 'Throw error deliberately.'
    const transactionRunner = database.createTransactionRunner()
    try {
      await transactionRunner.commit(async (transaction: Transaction) => {
        for (let i = 0; i < count; ++i) {
          const adder = new SQLAdder(database)
          adder.transaction = transaction
          adder.setTable('demo_table_2')
          adder.insertKV('key1', `K1 - ${Math.random()}`)
          adder.insertKV('key2', `K2 - ${Math.random()}`)
          await adder.execute()

          await buildSomeRecords(2)
          assert.equal(await globalSearcher.queryCount(), 2 * (i + 1))
        }
        throw new Error(errorMessage)
      })
      assert.fail()
    } catch (e: any) {
      assert.equal(e.message, errorMessage)
    }
    assert.equal(await globalSearcher.queryCount(), 2 * count)
  })

  it(`Test Normal`, async () => {
    await clearRecords()

    const count = 5
    const modifyUid = 1
    const modifyContent = '345678'
    const deleteUid = 2
    const key2Desc = 'zxcvbn'

    const transactionRunner = database.createTransactionRunner()
    await transactionRunner.commit(async (transaction) => {
      const nextActions: NextAction[] = []
      for (let i = 0; i < count; ++i) {
        console.info(`Fake operation: Index - ${i}`)
        const adder = new SQLAdder(database)
        adder.transaction = transaction
        adder.setTable('demo_table_2')
        adder.insertKV('key1', `K1 - ${Math.random()}`)
        adder.insertKV('key2', `K2 - ${Math.random()}`)
        const uid = await adder.execute()
        nextActions.push(async () => {
          console.info(`After transaction committed: [uid: ${uid}]`)
          assert.ok(uid > 0)
        })

        {
          const items = await database.query('SELECT COUNT(*) AS count FROM demo_table_2')
          assert.ok(Array.isArray(items))
          const count = items[0]['count']
          assert.equal(count, 0)
        }

        {
          const items = await database.query('SELECT COUNT(*) AS count FROM demo_table_2', [], transaction)
          assert.ok(Array.isArray(items))
          const count = items[0]['count']
          assert.equal(count, i + 1)
        }
      }

      const modifier = new SQLModifier(database)
      modifier.transaction = transaction
      modifier.setTable('demo_table_2')
      modifier.updateKV('key1', modifyContent)
      modifier.addConditionKV('uid', modifyUid)
      await modifier.execute()

      const remover = new SQLRemover(database)
      remover.transaction = transaction
      remover.setTable('demo_table_2')
      remover.addConditionKV('uid', deleteUid)
      await remover.execute()

      return nextActions
    })

    assert.equal(await globalSearcher.queryCount(), count - 1)

    await database.update('UPDATE demo_table_2 SET key2 = ?', [key2Desc])
    {
      const searcher = new SQLSearcher(database)
      searcher.setTable('demo_table_2')
      searcher.setColumns(['*'])
      searcher.addConditionKV('uid', modifyUid)
      const data = (await searcher.querySingle()) as any
      assert.equal(data['key1'], modifyContent)
    }

    {
      const searcher = new SQLSearcher(database)
      searcher.setTable('demo_table_2')
      searcher.setColumns(['*'])
      searcher.addConditionKV('uid', deleteUid)
      const data = await searcher.querySingle()
      assert.ok(data === undefined)
    }

    {
      const items = await globalSearcher.queryList()
      items.forEach((item: any) => {
        assert.equal(item['key2'], key2Desc)
      })
    }
  })
})
