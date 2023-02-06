import { Resque } from '../src'
import * as fs from 'fs'
import * as assert from 'assert'
const config = require('./config')

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

describe('Resque Test', () => {
  it(`Test enqueue`, async () => {
    Resque.setRedisBackend(config.redisConfig)
    const content = 'Hello.'
    const file = `${__dirname}/run.local/temp.txt`
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
    await Resque.enqueue('TaskQueueDemo', 'TaskDemo', { file: file, content: content })

    assert.ok(!fs.existsSync(file))
    await sleep(500)

    const content2 = fs.readFileSync(file, 'utf8')
    assert.ok(content === content2)

    fs.unlinkSync(file)
  })
})
