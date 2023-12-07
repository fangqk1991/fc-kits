import * as assert from 'assert'
import { FCDatabase } from 'fc-sql'
import DemoTable from './DemoTable+Service'

const database = FCDatabase.getInstance()
database.init({
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  database: 'demo_db',
  username: 'root',
  password: '',
  timezone: '+08:00',
  // logging: false,
  // dialectOptions: {
  //   dateStrings: true,
  //   typeCast: true,
  // }
})

const clearRecords = async () => {
  await database.update('TRUNCATE demo_table')
}

const buildSomeRecords = async (count: number) => {
  for (let i = 0; i < count; ++i) {
    const feed = new DemoTable()
    feed.key1 = `K1 - ${Math.random()}`
    feed.key2 = `K2 - ${Math.random()}`
    await feed.addToDB()
  }
}

describe('Test DemoTable.Transaction', (): void => {
  it(`Test Rollback`, async () => {
    await clearRecords()
    const count = 5
    const errorMessage = 'Throw error deliberately.'

    const transactionRunner = database.createTransactionRunner()
    try {
      await transactionRunner.commit(async (transaction) => {
        for (let i = 0; i < count; ++i) {
          const feed = new DemoTable()
          feed.key1 = `K1 - ${Math.random()}`
          feed.key2 = `K2 - ${Math.random()}`
          await feed.addToDB(transaction)

          await buildSomeRecords(2)
          assert.equal(await DemoTable.count(), 2 * (i + 1))
        }
        throw new Error(errorMessage)
      })
    } catch (e: any) {
      assert.equal(e.message, errorMessage)
    }

    assert.equal(await DemoTable.count(), 2 * count)
  })

  it(`Test Normal`, async () => {
    await clearRecords()

    {
      const count = 5
      const transactionRunner = database.createTransactionRunner()
      await transactionRunner.commit(async (transaction) => {
        for (let i = 0; i < count; ++i) {
          console.info(`Fake operation: Index - ${i}`)

          const feed = new DemoTable()
          feed.key1 = `K1 - ${Math.random()}`
          feed.key2 = `K2 - ${Math.random()}`
          await feed.addToDB(transaction)
          assert.ok(feed.uid > 0)
          console.info(`Transaction callback: [uid: ${feed.uid}]`)

          {
            const items = await database.queryV2('SELECT COUNT(*) AS count FROM demo_table')
            const count = items[0]['count']
            assert.equal(count, 0)
          }
          {
            const items = await database.queryV2('SELECT COUNT(*) AS count FROM demo_table', {
              transaction: transaction,
            })
            const count = items[0]['count']
            assert.equal(count, i + 1)
          }
        }
      })
    }

    {
      const modifyUid = 1
      const modifyContent = '345678'
      const deleteUid = 2

      const count = await DemoTable.count()
      const transactionRunner = database.createTransactionRunner()
      await transactionRunner.commit(async (transaction) => {
        {
          const feed = (await DemoTable.prepareWithUid(modifyUid, transaction)) as DemoTable
          feed.fc_edit()
          feed.key1 = modifyContent
          await feed.updateToDB(transaction)
        }
        {
          const feed = (await DemoTable.prepareWithUid(deleteUid, transaction)) as DemoTable
          await feed.deleteFromDB(transaction)
        }
      })

      assert.equal(await DemoTable.count(), count - 1)

      {
        const feed = (await DemoTable.findWithUid(modifyUid)) as DemoTable
        assert.ok(!!feed)
        assert.equal(feed.key1, modifyContent)
      }

      {
        const feed = await DemoTable.findWithUid(deleteUid)
        assert.ok(feed === undefined)
      }
    }
  })
})
