import { ResqueJob } from './ResqueJob'
import * as os from 'os'
import { Resque } from './Resque'
import { ResqueQueue } from './ResqueQueue'
import { ResqueStat } from './ResqueStat'

const moment = require('moment')

export class ResqueWorker {
  private readonly _queues: string[]
  private readonly _id: string
  private _willStop = false
  private _isBusy = false
  private _isTerminated = false

  public constructor(queues: string[], workerId: string = '') {
    this._queues = queues

    if (!workerId) {
      workerId = `${os.hostname()}:${process.pid}:${queues.join(',')}`
    }
    this._id = workerId
  }

  public stop() {
    this._willStop = true
  }

  public isTerminated() {
    return this._isTerminated
  }

  public isBusy() {
    return this._isBusy
  }

  public getID() {
    return this._id
  }

  public static redisKey_workerSet() {
    return 'resque:workers'
  }

  private redisKey_workerInfo() {
    return `resque:worker:${this._id}`
  }

  private redisKey_workerStarted() {
    return `${this.redisKey_workerInfo()}:started`
  }

  public async work() {
    await Resque.broadcast().onWorkerStart(this)
    await this.registerWorker()

    while (!this._willStop) {
      const job = await this.waitJob().catch(async (err) => {
        console.error(err)
        await Resque.broadcast().onRedisConnectionError(err)
      })
      if (!(job instanceof ResqueJob)) {
        continue
      }
      this._isBusy = true

      await Resque.broadcast().onJobFound(job)

      {
        const data = JSON.stringify({
          queue: job.queue,
          run_at: moment().format(),
          payload: job.payload,
        })
        await Resque.redis().set(this.redisKey_workerInfo(), data)
      }

      await Resque.broadcast().onJobPerform(job)

      try {
        await job.perform()
        await Resque.broadcast().onJobDone(job)

        await ResqueStat.incr(`processed`)
        await ResqueStat.incr(`processed:${this.getID()}`)
        await Resque.redis().del(this.redisKey_workerInfo())
      } catch (e: any) {
        await this.onJobFailed(job, e)
      }
      this._isBusy = false
    }
    this._isTerminated = true
  }

  public async registerWorker() {
    await Resque.redis().sadd(ResqueWorker.redisKey_workerSet(), this._id)
    await Resque.redis().set(this.redisKey_workerStarted(), moment().format())
  }

  public async unregisterWorker() {
    const id = this._id
    await Resque.redis().srem(ResqueWorker.redisKey_workerSet(), id)
    await Resque.redis().del(this.redisKey_workerInfo())
    await Resque.redis().del(this.redisKey_workerStarted())
    await ResqueStat.clear(`processed:${id}`)
    await ResqueStat.clear(`failed:${id}`)
  }

  public async queues() {
    if (!this._queues.includes('*')) {
      return this._queues
    }
    return ResqueQueue.queues()
  }

  public async waitJob() {
    const queues = await this.queues()
    const list = queues.map((queue: string) => `resque:queue:${queue}`)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const arr = (await Resque.specifiedRedis(this.getID()).blpop(...list, 0)) as string[]
    if (arr.length === 0) {
      return null
    }

    const queue = arr[0].replace('resque:queue:', '')
    const payload = JSON.parse(arr[1])
    return new ResqueJob(queue, payload)
  }

  private async onJobFailed(job: ResqueJob, exception: Error) {
    const data = {
      failed_at: moment().format(),
      payload: job.payload,
      exception: exception.constructor.name,
      error: exception.message,
      backtrace: exception.stack,
      worker: this.getID(),
      queue: job.queue,
    }
    await Resque.redis().rpush('resque:failed', JSON.stringify(data))
    await ResqueStat.incr(`failed`)
    await ResqueStat.incr(`failed:${this.getID()}`)
    await Resque.broadcast().onJobFailed(job, exception)
  }

  public async job() {
    const job = await Resque.redis().get(this.redisKey_workerInfo())
    if (!job) {
      return {}
    } else {
      return JSON.parse(job)
    }
  }

  public static async allWorkers() {
    const items = (await Resque.redis().smembers(ResqueWorker.redisKey_workerSet())) || []
    return items.map((workerId: string) => {
      // const [hostname, pid, queuesStr] = workerID.split(':')
      const arr = workerId.split(':')
      const queues = arr[2].split(',')
      return new ResqueWorker(queues, workerId)
    })
  }
}
