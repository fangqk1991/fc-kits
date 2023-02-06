import * as fs from 'fs'
import { Resque, ResqueWorker } from '..'
import { TaskCenter } from '../job/TaskCenter'
import { RedisConfig } from '../kernel/RedisConfig'
import * as assert from 'assert'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class FCMaster {
  public readonly redisConfig: RedisConfig
  private readonly _queues: string[]

  constructor(options: {
    /**
     * @deprecated Use redisConfig instead.
     */
    redisBackend?: string
    redisConfig?: RedisConfig
    queues: string[]
    moduleMapFile?: string
    moduleMapData?: { [p: string]: any }
  }) {
    if (!options.redisBackend && !options.redisConfig) {
      throw new Error(`redisConfig error`)
    }
    if (!options.redisConfig) {
      const [host, port] = options.redisBackend!.split(':')
      assert.ok(!!host)
      assert.ok(!!port)
      options.redisConfig = {
        redisHost: host,
        redisPort: Number(port),
      }
    }
    if (!Array.isArray(options.queues)) {
      throw new Error(`queues error`)
    }

    if (options.moduleMapData) {
      TaskCenter.initForModuleMapData(options.moduleMapData)
    } else {
      const moduleMapFile = options.moduleMapFile
      if (!moduleMapFile || !fs.existsSync(moduleMapFile)) {
        throw new Error(`moduleMapFile error`)
      }
      TaskCenter.initForModuleMapFile(moduleMapFile)
    }

    this.redisConfig = options.redisConfig!
    this._queues = options.queues
  }

  async run() {
    Resque.setRedisBackend(this.redisConfig)
    {
      // clear dead workers
      const workers = await ResqueWorker.allWorkers()
      for (let i = 0; i < workers.length; ++i) {
        await workers[i].unregisterWorker()
      }
    }

    const workers = this._queues.map((queue) => new ResqueWorker([queue]))
    for (const worker of workers) {
      worker.work()
    }
    await Resque.broadcast().onMasterLaunched()

    process.on('SIGTERM', async () => {
      for (const worker of workers) {
        worker.stop()
      }
      await Resque.broadcast().onTerminalProgressUpdated(`Received SIGTERM signal, the app is going to stop`)
      const totalCount = workers.length
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const closableCount = workers.filter((work) => work.isTerminated() || !work.isBusy()).length
        if (closableCount === totalCount) {
          process.exit(0)
          break
        }
        const terminatedCount = workers.filter((work) => work.isTerminated()).length
        const busyCount = workers.filter((work) => work.isBusy()).length
        await Resque.broadcast().onTerminalProgressUpdated(
          `Total ${totalCount} Workers, ${terminatedCount} terminated, ${busyCount} busy, waiting for 1s...`
        )
        await sleep(1000)
      }
    })
  }
}
