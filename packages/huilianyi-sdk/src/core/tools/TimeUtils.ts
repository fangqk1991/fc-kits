import * as moment from 'moment/moment'

export class TimeUtils {
  // 2023-07-29 16:00:00 -> 2023-07-29T16:00:00+08:00
  public static correctUTC8Timestamp(timeStr: string) {
    return moment(timeStr).utcOffset('+08:00', true).format()
  }

  public static momentUTC8(time: string) {
    return moment(time).utcOffset('+08:00', false)
  }

  public static timeStrUTC8(time: string) {
    return moment(time).utcOffset('+08:00').format('YYYY-MM-DD HH:mm:ss')
  }

  public static diff(timeStr1: string, timeStr2: string) {
    return moment(timeStr1).valueOf() - moment(timeStr2).valueOf()
  }

  public static min(timeStr: string, ...timeStrList: string[]) {
    for (const timeStr2 of timeStrList) {
      if (this.diff(timeStr2, timeStr) < 0) {
        timeStr = timeStr2
      }
    }
    return timeStr
  }

  public static max(timeStr: string, ...timeStrList: string[]) {
    for (const timeStr2 of timeStrList) {
      if (this.diff(timeStr2, timeStr) > 0) {
        timeStr = timeStr2
      }
    }
    return timeStr
  }
}
