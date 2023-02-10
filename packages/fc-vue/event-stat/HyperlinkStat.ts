import { LoadingView } from '../src/loading'
import { MyAxios } from '../basic'
import { SdkEventStatApis } from '@fangcha/event-stat/lib/common/apis'
import { EventOptions } from '@fangcha/event-stat/lib/common/models'

export class HyperlinkStat {
  public static click(link: string) {
    LoadingView.loadHandler('Redirecting...', async () => {
      const request = MyAxios(SdkEventStatApis.EventStat)
      request.setBodyData({
        eventType: 'Hyperlink',
        content: link,
      } as EventOptions)
      await request.execute()
      window.open(link)
    })
  }
}
