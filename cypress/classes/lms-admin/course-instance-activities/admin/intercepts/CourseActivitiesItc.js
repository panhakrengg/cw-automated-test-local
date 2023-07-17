import InterceptReq from '../../../../base/InterceptReq'

class CourseActivitiesItc {
  static itcFetchManageCourseActivities = new InterceptReq(
    '/manage_courses/course_activities/fetch',
    'FetchManageCourseActivities'
  )
  static itcFetchCourseActivitiesSequential = new InterceptReq(
    '/course_activities/sequential/fetch',
    'FetchCourseActivitiesSequential'
  )
  static itcSearchActivityLibrary = new InterceptReq(
    '/activity_library/search',
    'SearchActivityLibrary'
  )
  static itcModifyCourseActivity = new InterceptReq(
    '/manage_courses/course_activity/modify',
    'ModifyCourseActivity'
  )
  static itcDeleteCourseActivity = new InterceptReq(
    '/manage_courses/course_activity/delete',
    'DeleteCourseActivity'
  )
}

export default CourseActivitiesItc
