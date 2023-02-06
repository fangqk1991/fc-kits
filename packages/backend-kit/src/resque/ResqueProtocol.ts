import { RedisConfig } from '@fangcha/resque/lib/kernel/RedisConfig'
import { IResqueObserver } from '@fangcha/resque'

export interface ResqueProtocol {
  redisConfig: RedisConfig
  queues: string[]
  moduleMapData: {
    [p: string]: any
  }
  observer?: IResqueObserver
}
