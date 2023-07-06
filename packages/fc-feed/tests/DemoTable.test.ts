import * as assert from 'assert'
import DemoTable from './DemoTable'

describe('Test DemoTable', (): void => {
  it(`Test Normal Feed`, async () => {
    const searcher = new DemoTable().fc_searcher()
    const countBefore = await searcher.queryCount()

    const count = 5
    for (let i = 0; i < count; ++i) {
      const feed = new DemoTable()
      feed.key1 = `K1 - ${Math.random()}`
      feed.key2 = `K2 - ${Math.random()}`
      await feed.addToDB()
      const newFeed = await DemoTable.prepareWithUid(feed.uid)
      assert.equal(feed.uid, newFeed.uid)
      assert.equal(feed.key1, newFeed.key1)
      assert.equal(feed.key2, newFeed.key2)
    }

    const countAfter = await searcher.queryCount()
    assert.ok(countBefore + count === countAfter)

    {
      const items = await searcher.queryAllFeeds()
      const watchUID = (items[0] as any)['uid'] as string
      const feed = await DemoTable.prepareOne({
        uid: watchUID,
      })
      feed.fc_edit()
      feed.key1 = 'K1 - New'
      await feed.updateToDB()

      const feed2 = await DemoTable.prepareOne({
        uid: watchUID,
      })

      assert.ok(feed.uid === feed2.uid)
      assert.ok(feed.key2 === feed2.key2)
      assert.ok(feed2.key1 === 'K1 - New')

      await feed.deleteFromDB()

      const feed3 = await DemoTable.findOne({
        uid: watchUID,
      })
      assert.ok(feed3 === undefined)
    }

    {
      const items = (await searcher.queryAllFeeds()) as DemoTable[]
      const watchUID = items[0].uid
      const feed = (await DemoTable.findOne({
        uid: watchUID,
      })) as DemoTable
      feed.fc_edit()
      feed.key1 = 'K1 - New'
      await feed.fc_update()

      const feed2 = (await DemoTable.findOne({
        uid: watchUID,
      })) as DemoTable

      assert.ok(feed.uid === feed2.uid)
      assert.ok(feed.key2 === feed2.key2)
      assert.ok(feed2.key1 === 'K1 - New')

      await feed.fc_delete()

      const feed3 = (await DemoTable.findOne({
        uid: watchUID,
      })) as DemoTable
      assert.ok(!feed3)
    }
  })

  it(`Test fc_searcher`, async () => {
    const searcher = new DemoTable().fc_searcher()
    const allCount = await searcher.queryCount()

    {
      const length = Math.floor(allCount / 2)
      const searcher = new DemoTable().fc_searcher({
        _sortKey: 'uid',
        _sortDirection: 'DESC',
        _offset: 0,
        _length: length,
      })
      const feedsCount = await searcher.queryCount()
      assert.equal(feedsCount, allCount)

      const feeds = await searcher.queryFeeds()
      let prevUID = Number.MAX_VALUE
      for (const feed of feeds) {
        assert.ok(prevUID > feed.uid)
        prevUID = feed.uid
      }
    }
  })

  it(`Test getPageResult`, async () => {
    const pageResult = await DemoTable.getPageResult<{}>({
      // [`uid.$in`]: [4, 5],
      // [`uid.$notIn`]: [4],
      // [`uid.$inStr`]: '5',
      // [`uid.$notInStr`]: '3,4',
      [`uid.$gt`]: 3,
      [`uid.$ne`]: '5',
      [`uid.$le`]: '5',
    })
    pageResult.items.forEach((item) => {
      console.info(item)
    })
  })
})
