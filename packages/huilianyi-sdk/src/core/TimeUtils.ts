import * as moment from 'moment/moment'

export class TimeUtils {
  public static momentUTC8(time: string) {
    return moment(time).utcOffset('+08:00')
  }

  public static timeStrUTC8(time: string) {
    return this.momentUTC8(time).format('YYYY-MM-DD HH:mm:ss')
  }
}
