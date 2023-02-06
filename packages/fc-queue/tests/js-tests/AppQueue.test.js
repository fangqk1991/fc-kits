const { AppQueue } = require('../../lib')
const assert = require('assert')

describe('Test AppQueue', () => {
  it(`Test functions`, async () => {
    const queue = new AppQueue()

    assert.ok(queue.isEmpty())

    queue.push(100)
    queue.push(200)
    assert.ok(!queue.isEmpty())
    assert.ok(queue.getFirst() === 100)
    assert.ok(queue.size() === 2)

    assert.ok(queue.popFirst() === 100)
    assert.ok(!queue.isEmpty())
    assert.ok(queue.size() === 1)
    assert.ok(queue.getFirst() === 200)

    assert.ok(queue.popFirst() === 200)
    assert.ok(queue.isEmpty())
    assert.ok(queue.size() === 0)

    assert.ok(queue.getFirst() === null)

    try {
      queue.popFirst()
      assert.fail()
    } catch (e) {
    }
  })
})
