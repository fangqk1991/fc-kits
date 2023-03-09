import { AxiosBuilder } from '@fangcha/app-request'
import AppError from '@fangcha/app-error'
import * as moment from 'moment'
import { RequestFollower, ServiceProxy } from '@fangcha/app-request-extensions'
const os = require('os')

interface ApiErrorParams {
  user: string
  method: string
  api: string
  statusCode: number
  errorMsg: string
  reqid: string
  duration: number
  referer: string
  ipAddress: string
}

export abstract class BotCore extends ServiceProxy {
  protected abstract makeRequest(botKey: string, message: string, mentionedList?: string[]): AxiosBuilder

  protected _tag: string = ''
  protected _mute: boolean = false
  protected _hostnameHidden: boolean = false
  protected _appName: string = ''
  protected _retainedBotKey!: string
  public readonly hostname: string

  public constructor(config: {}, observerClass?: { new (requestId?: string): RequestFollower }) {
    super(config, observerClass)
    this.hostname = os.hostname()
  }

  public setTag(tag: string) {
    this._tag = tag
    return this
  }

  public setRetainedBotKey(botKey: string) {
    this._retainedBotKey = botKey
    return this
  }

  public setMuteMode(mute = true) {
    this._mute = mute
    return this
  }

  public setHostnameHidden(hostnameHidden = true) {
    this._hostnameHidden = hostnameHidden
    return this
  }

  public setAppName(appName: string) {
    this._appName = appName
    return this
  }

  public async sendMessage(botKey: string, message: string, mentionedList?: string[]) {
    const extrasList: string[] = []
    if (this._tag) {
      extrasList.push(this._tag)
    }
    if (this._appName) {
      extrasList.push(this._appName)
    }
    if (!this._hostnameHidden) {
      extrasList.push(this.hostname)
    }
    const extras = extrasList.map((item) => `[${item}]`).join('')
    message = `${extras} ${message}`
    if (this._mute) {
      console.error('sendMessage in mute-mode:', message)
      return
    }
    const request = this.makeRequest(botKey, message, mentionedList)
    await request.execute()
  }

  public async notify(message: string, atAll = false) {
    if (!this._retainedBotKey) {
      console.error('_retainedBotKey missing.')
      return
    }
    try {
      await this.sendMessage(this._retainedBotKey, message, atAll ? ['@all'] : [])
    } catch (e) {
      console.error(e)
    }
  }

  public async notifyHealthCheckingError(message: string) {
    await this.notify(['Health Checking Error', message].join('\n'))
  }

  public async notifyServiceInvokingError(serviceName: string, client: AxiosBuilder, error: AppError) {
    if (error.statusCode >= 500) {
      const commonApi = client.commonApi
      const url = client.getRequestUrl()
      const statusCode = error.statusCode || 500
      const errorMsg = error.message
      const reqid = client.headers['x-request-id'] || ''
      const infos = [
        `Invoking Error: ${serviceName}`,
        `Error: [${statusCode}] ${errorMsg}`,
        `Action: ${commonApi.method} ${url}`,
        `Reqid: ${reqid}`,
        `Duration: ${client.getDuration()}ms`,
        `Time: ${moment().format()}`,
      ]
      return this.notify(infos.join('\n'))
    }
  }

  public async notifyApiError(params: ApiErrorParams) {
    const infos = [
      `Api Error`,
      `Error: [${params.statusCode}] ${params.errorMsg}`,
      `Action: ${params.method} ${params.api}`,
      `User: ${params.user}`,
      `Reqid: ${params.reqid}`,
      `Referer: ${params.referer}`,
      `Duration: ${params.duration}ms`,
      `IP Address: ${params.ipAddress}`,
      `Time: ${moment().format()}`,
    ]
    return this.notify(infos.join('\n'))
  }
}
