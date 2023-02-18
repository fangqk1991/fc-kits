import { axiosPOST } from '@fangcha/app-request'
import { BotCore } from './BotCore'

export class FeishuBot extends BotCore {
  protected makeRequest(botKey: string, message: string) {
    const request = axiosPOST(`https://open.feishu.cn/open-apis/bot/v2/hook/${botKey}`).setTimeout(15000)
    this.onRequestMade(request)
    const params = {
      msg_type: 'text',
      content: {
        text: message,
      },
    }
    request.setBodyData(params)
    return request
  }
}
