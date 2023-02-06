const { AppTask, AppTaskQueue } = require('../../lib')
const assert = require('assert')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

describe('Test AppTaskQueue', () => {
  it(`Test arguments' type`, async () => {
    try {
      const task = new AppTask(1)
      console.log(task)
      assert.fail()
    } catch (e) {
    }

    try {
      const task = new AppTask(() => {})
      console.log(task)
      assert.fail()
    } catch (e) {
    }

    try {
      const taskQueue = new AppTaskQueue()
      taskQueue.addTask('must be an AppTask instance')
      assert.fail()
    } catch (e) {
    }
  })

  it(`Test single queue`, async () => {
    const taskQueue = new AppTaskQueue()
    taskQueue.setPendingLimit(-1)

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []
    const start = Date.now()
    const gap = 50

    items.forEach(function (value) {
      taskQueue.addTask(new AppTask(async (item) => {
        await sleep(gap)
        result.push(item)

        assert.ok(taskQueue.runningQueue().size() === 1)
        assert.ok(taskQueue.pendingQueue().size() === items.length - result.length)
      }, value))
    })

    taskQueue.setOnEmptyCallback(() => {
      const duration = Date.now() - start
      assert.ok(duration > gap * items.length)
      assert.ok(duration - gap * items.length < 100)
      assert.ok(items.join(',') === result.join(','))

      assert.ok(taskQueue.runningQueue().size() === 0)
      assert.ok(taskQueue.pendingQueue().size() === 0)
      assert.ok(taskQueue.failureQueue().size() === 0)
    })

    assert.ok(taskQueue.pendingQueue().size() === items.length)
    assert.ok(taskQueue.runningQueue().size() === 0)
    taskQueue.resume()
  })

  it(`Test concurrent queue`, async () => {
    const concurrent = 5
    const taskQueue = new AppTaskQueue()
    taskQueue.setMaxConcurrent(concurrent)

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []
    const start = Date.now()
    const gap = 50

    items.forEach(function (value) {
      taskQueue.addTask(new AppTask(async (item) => {
        await sleep(gap)
        result.push(item)
      }, value))
    })

    taskQueue.setOnEmptyCallback(() => {
      const duration = Date.now() - start
      assert.ok(duration < gap * items.length)
      assert.ok(duration * concurrent > gap * items.length)
      assert.ok(result.length === items.length)
    })
    taskQueue.resume()
  })

  it(`Test task-cancel`, async () => {
    const taskQueue = new AppTaskQueue()

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []
    const gap = 50

    items.forEach(function (value) {
      const task = new AppTask(async (item) => {
        await sleep(gap)
        result.push(item)
      }, value)
      taskQueue.addTask(task)

      if (value % 2 === 0) {
        task.cancel()
      }
    })

    taskQueue.setOnEmptyCallback(() => {
      assert.ok(items.filter(value => value % 2 !== 0).join(',') === result.join(','))
    })
    taskQueue.resume()
  })

  it(`Test task-exception`, async () => {
    const taskQueue = new AppTaskQueue()

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []
    const gap = 50

    items.forEach(function (value) {
      const task = new AppTask(async (item) => {
        await sleep(gap)
        if (value % 2 === 0) {
          throw new Error('wrong.')
        }
        result.push(item)
      }, value)
      taskQueue.addTask(task)
    })

    taskQueue.setOnEmptyCallback(() => {
      assert.ok(items.filter(value => value % 2 !== 0).join(',') === result.join(','))
      assert.ok(taskQueue.failureQueue().size() === items.filter(value => value % 2 === 0).length)
      assert.ok(taskQueue.failureQueue().size() + taskQueue.processedCount() === items.length)
    })
    taskQueue.resume()
  })

  it(`Test queue-pause`, async () => {
    const taskQueue = new AppTaskQueue()
    taskQueue.setMaxConcurrent(2)

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []

    items.forEach(function (value, index) {
      taskQueue.addTask(new AppTask(async (item) => {
        if (index === 0) {
          taskQueue.pause()
        }
        result.push(item)
      }, value))
    })

    setTimeout(() => {
      assert.ok(result.length === 2)
      assert.ok(taskQueue.runningQueue().size() === 0)
      assert.ok(taskQueue.pendingQueue().size() === items.length - 2)
      taskQueue.resume()
    }, 100)

    taskQueue.setOnEmptyCallback(() => {
      assert.ok(items.join(',') === result.join(','))
    })
    taskQueue.resume()
  })

  it(`Test pending limit`, async () => {
    const taskQueue = new AppTaskQueue()
    taskQueue.setMaxConcurrent(2)
    taskQueue.setPendingLimit(5)

    const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const result = []

    items.forEach(function (value, index) {
      const flag = taskQueue.addTask(new AppTask(async (item) => {
        result.push(item)
      }, value))

      if (index >= 7) {
        assert.ok(!flag)
      } else {
        assert.ok(flag)
      }
    })

    taskQueue.setOnEmptyCallback(() => {
      assert.ok(items.slice(0, 7).join(',') === result.join(','))
    })
    taskQueue.resume()
  })
})
