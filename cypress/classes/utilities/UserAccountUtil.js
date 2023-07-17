import moment from 'moment'
import DateFormat from '../format-collections/DateFormat'

class UserAccountUtil {
  getDateByDefaultTimeZone(timezone = '+07:00') {
    return moment().utcOffset(timezone)
  }

  getDateByDefaultTimeZoneAndFormat(
    format = DateFormat.ACTIVITY_LOG_DATE_FORMAT,
    timezone = '+07:00'
  ) {
    return this.getDateByDefaultTimeZone(timezone).format(format)
  }
}

export default UserAccountUtil
