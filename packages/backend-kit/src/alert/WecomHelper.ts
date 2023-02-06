import { WecomProxy } from './WecomProxy'
import { _FangchaState } from '../main'

export class WecomHelper {
  public static makeWecomProxy(botKey: string, env?: string) {
    env = env || _FangchaState.env
    const proxy = new WecomProxy({})
    if (!['staging', 'production'].includes(env)) {
      proxy.setMuteMode(true)
    }
    proxy.setTag(env)
    proxy.setRetainedBotKey(botKey)
    return proxy
  }
}
