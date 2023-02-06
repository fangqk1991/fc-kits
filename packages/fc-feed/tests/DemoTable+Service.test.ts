import * as assert from 'assert'
import DemoTable from './DemoTable+Service'
import { FCDatabase } from 'fc-sql'
import { DemoProtocol } from './DemoTable'

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

class MyProtocol extends DemoProtocol {
  insertableCols(): string[] {
    return ['uid', ...super.insertableCols()]
  }
}

const generateRecords = async (count: number) => {
  const feeds: DemoTable[] = []
  for (let i = 0; i < count; ++i) {
    const feed = await DemoTable.createFeed(`K1 - ${Math.random()}`, `K2 - ${Math.random()}`)
    feeds.push(feed)
  }
  return feeds
}

describe('Test DemoTable', (): void => {
  it(`Test Normal Feed`, async () => {
    const count = 5
    const countBefore = await DemoTable.count()
    await generateRecords(count)
    const countAfter = await DemoTable.count()
    assert.equal(countBefore + count, countAfter)
  })

  it(`Test weakAddToDB`, async () => {
    const feeds = await generateRecords(5)
    const countBefore = await DemoTable.count()

    for (const feed of feeds) {
      const newData = feed.fc_pureModel()
      newData.key1 = `K1 - ${Math.random()}`
      newData.key2 = `K2 - ${Math.random()}`
      const newFeed = new DemoTable()
      newFeed.setDBProtocolV2(new MyProtocol())
      newFeed.uid = feed.uid
      newFeed.key1 = newData.key1
      newFeed.key2 = newData.key2
      await newFeed.weakAddToDB()
      await newFeed.reloadDataFromDB()
      assert.equal(feed.uid, newFeed.uid)
      assert.equal(feed.key1, newFeed.key1)
      assert.equal(feed.key2, newFeed.key2)
    }

    const countAfter = await DemoTable.count()
    assert.equal(countBefore, countAfter)
  })

  it(`Test strongAddToDB`, async () => {
    const feeds = await generateRecords(5)
    const countBefore = await DemoTable.count()

    for (const feed of feeds) {
      const newData = feed.fc_pureModel()
      newData.key1 = `K1 - ${Math.random()}`
      newData.key2 = `K2 - ${Math.random()}`
      const newFeed = new DemoTable()
      newFeed.setDBProtocolV2(new MyProtocol())
      newFeed.uid = feed.uid
      newFeed.key1 = newData.key1
      newFeed.key2 = newData.key2
      await newFeed.strongAddToDB()
      await newFeed.reloadDataFromDB()
      assert.equal(newData.uid, newFeed.uid)
      assert.equal(newData.key1, newFeed.key1)
      assert.equal(newData.key2, newFeed.key2)
    }

    const countAfter = await DemoTable.count()
    assert.equal(countBefore, countAfter)
  })
})
