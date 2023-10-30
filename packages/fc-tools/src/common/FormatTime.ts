import * as moment from 'moment'

export const FT = (timeStr: string | moment.Moment, formatStr = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(timeStr).format(formatStr)
}
