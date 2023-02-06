import * as IORedis from 'ioredis'
import { Redis } from 'ioredis'
import { ResqueJob } from './ResqueJob'
import { IResqueObserver } from './IResqueObserver'
import { ResqueTrigger } from './ResqueTrigger'
import * as assert from 'assert'
import { RedisConfig } from './RedisConfig'

class _Resque {
  private readonly _observers: IResqueObserver[]
  private readonly _broadcast: ResqueTrigger
  private readonly _redisMap!: { [p: string]: Redis }
  private _redisConfig!: RedisConfig
  private _redis!: Redis

  public constructor() {
    this._observers = []
    this._broadcast = new ResqueTrigger()
    this._redisMap = {}
  }

  /**
   * @deprecated Use setRedisBackend instead.
   * @param backend
   */
  public setBackend(backend: string) {
    const [host, port] = backend.split(':')
    assert.ok(!!host)
    assert.ok(!!port)
    this._redisConfig = {
      redisHost: host,
      redisPort: Number(port),
    }
  }

  public setRedisBackend(redisConfig: RedisConfig) {
    this._redisConfig = redisConfig
  }

  public redis() {
    if (this._redis) {
      return this._redis
    }
    this._redis = this._redisConfig.useCluster
      ? (new IORedis.Cluster([
          {
            host: this._redisConfig.redisHost,
            port: this._redisConfig.redisPort,
          },
        ]) as any)
      : new IORedis({
          host: this._redisConfig.redisHost,
          port: this._redisConfig.redisPort,
        })
    // TODO: Read-Timeout if need
    // $redis->setOption(Redis::OPT_READ_TIMEOUT, -1);
    return this._redis
  }

  public broadcast() {
    return this._broadcast
  }

  public specifiedRedis(uid: string) {
    if (!this._redisMap[uid]) {
      this._redisMap[uid] = this._redisConfig.useCluster
        ? (new IORedis.Cluster([
            {
              host: this._redisConfig.redisHost,
              port: this._redisConfig.redisPort,
            },
          ]) as any)
        : new IORedis({
            host: this._redisConfig.redisHost,
            port: this._redisConfig.redisPort,
          })
    }
    return this._redisMap[uid]
  }

  public async enqueue(queue: string, className: string, args = {}) {
    const job = await ResqueJob.generate(queue, className, args)
    await job.addToQueue()
    return job
  }

  public addObserver(observer: IResqueObserver) {
    this._observers.push(observer)
  }

  public observers() {
    return this._observers
  }
}

export const Resque = new _Resque()
