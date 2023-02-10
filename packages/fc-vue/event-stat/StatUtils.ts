import { MyAxios } from '../basic'
import { SdkEventStatApis } from '@fangcha/event-stat/lib/common/apis'
import { EventOptions } from '@fangcha/event-stat/lib/common/models'

export class StatUtils {
  public static statEvent(eventType: string, params: any = {}) {
    const request = MyAxios(SdkEventStatApis.EventStat)
    request.setBodyData({
      eventType: eventType,
      content: params,
    } as EventOptions)
    request.ignoreError()
    request.execute()
  }
}
