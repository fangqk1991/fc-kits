import { logger } from '@fangcha/logger'
import * as os from 'os'
import { BotCore, WecomProxy } from '@fangcha/bot-kit'

type UserInfoTransfer = (item: any) => any

class __FangchaState {
  appName: string = ''

  env: string = 'development'
  tags: string[] = []

  codeVersion: string = ''
  runningMachine: string = ''
  retainHealthWord: string = ''

  botProxy: BotCore = new WecomProxy({})

  _checkHealthHandler = async () => {}

  constructor() {
    this.codeVersion = process.env.CODE_VERSION || 'Unknown'
    this.runningMachine = os.hostname() || 'Unknown'
  }

  async checkHealth() {
    await this._checkHealthHandler()
      .then(() => {
        logger.info(`[${this.env}] Health Checking Passed.`)
      })
      .catch((err) => {
        logger.error(err)
        _FangchaState.botProxy.notifyHealthCheckingError(err.message)
        throw err
      })
  }

  public appInfo() {
    return {
      env: this.env,
      tags: this.tags,
      codeVersion: this.codeVersion,
      runningMachine: this.runningMachine,
    }
  }

  public frontendConfig: any = {}

  private _transferHandlers: UserInfoTransfer[] = []

  public addUserInfoTransfer(handler: UserInfoTransfer) {
    this._transferHandlers.push(handler)
  }

  public transferSessionUserInfo = async (userInfo: any) => {
    for (const handler of this._transferHandlers) {
      userInfo = handler(userInfo)
    }
    return userInfo
  }

  public updateFrontendConfig(extras: {}) {
    Object.assign(this.frontendConfig, extras)
  }
}

export const _FangchaState = new __FangchaState()
