import { axiosPOST } from '@fangcha/app-request'
import { BotCore } from './BotCore'

export class WecomProxy extends BotCore {
  protected makeRequest(botKey: string, message: string, mentionedList?: string[]) {
    const request = axiosPOST('https://qyapi.weixin.qq.com/cgi-bin/webhook/send').setTimeout(15000)
    request.setQueryParams({
      key: botKey,
    })
    this.onRequestMade(request)
    const params = {
      msgtype: 'text',
      text: {
        content: message,
        // mentioned_list: mentionedList,
      },
    }
    if (Array.isArray(mentionedList) && mentionedList.length > 0) {
      params.text['mentioned_list'] = mentionedList
      params.text.content += '\n\n'
    }
    request.setBodyData(params)
    return request
  }

  public async sendMarkdown(botKey: string, message: string) {
    const extrasList: string[] = []
    if (this._tag) {
      const tag = this._tag === 'production' ? `<font color="info">${this._tag}</font>` : this._tag
      extrasList.push(tag)
    }
    if (this._appName) {
      extrasList.push(this._appName)
    }
    if (!this._hostnameHidden) {
      extrasList.push(this.hostname)
    }
    message = [extrasList.map((item) => `[${item}]`).join(''), `> ${message}`].join('\n')
    if (this._mute) {
      console.error('sendMessage in mute-mode:', message)
      return
    }
    const request = this.makeRequest(botKey, message)
    const params = {
      msgtype: 'markdown',
      markdown: {
        content: message,
      },
    }
    request.setBodyData(params)
    await request.execute()
  }
}
