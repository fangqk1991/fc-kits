import { ChannelTask, ChannelTaskManager, sleep } from '../src'
import * as assert from 'assert'

describe('Test ChannelManager.test.ts', () => {
  it(`Test: multi-execute`, async () => {
    const channelName = 'xxx'
    let matchedResult = 0
    await Promise.all(
      new Array(100).fill(1).map((_, index) => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          assert.strictEqual(index, 0)
          console.info('0. handler running.', index)
          // await sleep(1000)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 0)
        })
      })
    )
    assert.strictEqual(matchedResult, 1)

    ChannelTaskManager.handleInChannel(channelName, async () => {
      console.info('1. handler running.')
      await sleep(0)
      return matchedResult++
    }).then((result) => {
      assert.strictEqual(result, 1)
    })
    assert.strictEqual(matchedResult, 1)

    await sleep(0)

    await Promise.all(
      new Array(100).fill(1).map((_, index) => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          assert.strictEqual(index, 0)
          console.info('2. handler running.')
          await sleep(10)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 2)
        })
      })
    )
    assert.strictEqual(matchedResult, 3)
  })

  it(`Test: exception`, async () => {
    const channelName = 'xxx'
    let matchedResult = 0
    await Promise.all([
      ChannelTaskManager.handleInChannel(channelName, async () => {
        throw new Error('An Error')
      }).catch((err) => {
        console.info(`Catch Error:`, err.message)
      }),
      ...new Array(100).fill(1).map(() => {
        return ChannelTaskManager.handleInChannel(channelName, async () => {
          await sleep(2000)
          return matchedResult++
        }).then((result) => {
          assert.strictEqual(result, 0)
        })
      }),
    ])
    assert.strictEqual(matchedResult, 1)
  })

  it(`Test: ChannelTask`, async () => {
    let matchedResult = 0
    const task = new ChannelTask(async () => {
      await sleep(2000)
      return matchedResult++
    })
    await Promise.all(
      new Array(100).fill(1).map(() => {
        return task.execute().then((result) => {
          assert.strictEqual(result, 0)
        })
      })
    )
    assert.strictEqual(matchedResult, 1)
    console.info(ChannelTaskManager)
  })
})
