import { LoopPerformer, sleep } from '../src'

describe('Test LoopPerformer.test.ts', () => {
  it(`maxRepeat`, async () => {
    const performer = new LoopPerformer({
      period: 1000,
      errorHandler: (err) => {
        console.error(err)
      },
      maxRepeat: 10,
    })
    await performer.execute(async () => {
      console.info(`第 ${performer.curTimes()} 次执行`)
    })
  })

  it(`stop`, async () => {
    const performer = new LoopPerformer({
      period: 1000,
      errorHandler: (err) => {
        console.error(err)
      },
      maxRepeat: 10,
    })
    sleep(5000).then(() => performer.stop())
    await performer.execute(async () => {
      console.info(`第 ${performer.curTimes()} 次执行`)
    })
  })
})
