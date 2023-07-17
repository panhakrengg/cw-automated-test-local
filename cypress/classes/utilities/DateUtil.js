import moment from 'moment'

class DateUtil {
  getCurrentDate(formatDate) {
    return new moment().format(formatDate)
  }
  formatDate(date, formatDate) {
    return new moment(date).format(formatDate)
  }
  expectGetDateLessThenCurrentDate(dateString) {
    expect(Date.parse(dateString)).lessThan(Date.now())
  }
}

export default DateUtil
