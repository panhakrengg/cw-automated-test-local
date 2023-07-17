import InterceptReq from '../../../../base/InterceptReq'

class CourseInstanceOverviewItc {
  static itcCourseInstancePublish = new InterceptReq(
    '/manage_courses/course_instance/publish',
    'FetchCourseInstance'
  )
  static itcFetchCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'fetchCourseActivities'
  )
  static itcModifyCourseInstance = new InterceptReq(
    '/manage_courses/course_instance/modify',
    'ModifyCourseInstance'
  )
}

export default CourseInstanceOverviewItc
