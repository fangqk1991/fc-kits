import { Resque } from './Resque'

export class ResqueStat {
  public static async get(stat: string) {
    return Number(await Resque.redis().get(`resque:stat:${stat}`))
  }

  public static async incr(stat: string, by = 1) {
    await Resque.redis().incrby(`resque:stat:${stat}`, by)
  }

  public static async decr(stat: string, by = 1) {
    await Resque.redis().decrby(`resque:stat:${stat}`, by)
  }

  public static async clear(stat: string) {
    await Resque.redis().del(`resque:stat:${stat}`)
  }
}
