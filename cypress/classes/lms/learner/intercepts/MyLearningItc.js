import InterceptReq from '../../../base/InterceptReq'

class MyLearningItc {
  static fetchBookedCourseInfo = new InterceptReq(
    '/booked_course/course_info/fetch',
    'FetchBookedCourseInfo'
  )
  static searchCourseCatalog = new InterceptReq('/course_catalog/search', 'SearchCourseCatalog')
  static withdrawBookedCourseInstance = new InterceptReq(
    '/booked_course/course_instance/withdraw',
    'WithdrawBookedCourseInstance'
  )
}

export default MyLearningItc
