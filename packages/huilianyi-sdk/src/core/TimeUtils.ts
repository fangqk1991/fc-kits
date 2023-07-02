import * as moment from 'moment/moment'

export class TimeUtils {
  public static momentUTC8(time: string) {
    return moment(time).utcOffset('+08:00')
  }

  public static timeStrUTC8(time: string) {
    return this.momentUTC8(time).format('YYYY-MM-DD HH:mm:ss')
  }

  public static diff(timeStr1: string, timeStr2: string) {
    return moment(timeStr1).valueOf() - moment(timeStr2).valueOf()
  }

  public static min(timeStr1: string, timeStr2: string) {
    return this.diff(timeStr1, timeStr2) < 0 ? timeStr1 : timeStr2
  }

  public static max(timeStr1: string, timeStr2: string) {
    return this.diff(timeStr1, timeStr2) > 0 ? timeStr1 : timeStr2
  }

  public static monthStartDate(time: string) {
    return this.momentUTC8(time).startOf('month').format('YYYY-MM-DD')
  }

  public static monthEndDate(time: string) {
    return this.momentUTC8(time).endOf('month').format('YYYY-MM-DD')
  }
}
