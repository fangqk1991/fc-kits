import { AppProtocol } from '../basic'
import { _FangchaState } from './_FangchaState'
import { WecomProxy } from '../alert'
import { CustomRequestFollower } from './CustomRequestFollower'
import { initLoggerForApp } from '@fangcha/logger'

export class FangchaApp {
  public protocol: AppProtocol

  public constructor(protocol: AppProtocol) {
    this.protocol = protocol
  }

  public async launch() {
    _FangchaState.appName = this.protocol.appName
    _FangchaState.env = this.protocol.env
    _FangchaState.tags = this.protocol.tags || []
    _FangchaState.retainHealthWord = this.protocol.retainHealthWord || ''
    _FangchaState._checkHealthHandler = this.protocol.checkHealth || (async () => {})

    initLoggerForApp(this.protocol.appName)

    if (this.protocol.wecomBotKey) {
      const proxy = new WecomProxy({})
      if (!['staging', 'production'].includes(this.protocol.env)) {
        proxy.setMuteMode(true)
      }
      proxy.setTag(this.protocol.env)
      proxy.setRetainedBotKey(this.protocol.wecomBotKey)
      proxy.setAppName(this.protocol.appName)
      _FangchaState.botProxy = proxy
      CustomRequestFollower.botProxy = proxy
    }

    const plugins = this.protocol.plugins || []
    for (const plugin of plugins) {
      if (plugin.appWillLoad) {
        await plugin.appWillLoad(this.protocol)
      }
    }

    const appDidLoad = this.protocol.appDidLoad || (async () => {})
    await appDidLoad().catch((err) => {
      console.error(err)
      if (_FangchaState.botProxy) {
        _FangchaState.botProxy.notify(['App Loading Error', err.message].join('\n'))
      }
      throw err
    })

    for (const plugin of plugins) {
      await plugin.appDidLoad(this.protocol)
    }

    if (this.protocol.checkHealth) {
      await this.protocol.checkHealth()
    }
    for (const plugin of plugins) {
      if (plugin.checkHealth) {
        await plugin.checkHealth()
      }
    }

    _FangchaState.botProxy.notify(`[${_FangchaState.tags.join(', ')}] App launched.`)
  }
}
