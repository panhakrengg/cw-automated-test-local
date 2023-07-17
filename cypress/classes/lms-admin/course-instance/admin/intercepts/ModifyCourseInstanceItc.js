import InterceptReq from '../../../../base/InterceptReq'

class ModifyCourseInstanceItc {
  static itcCourseInstanceOptions = new InterceptReq(
    '/manage_courses/course_instance/options',
    'CourseInstanceOptions'
  )
  static itcUpdateInstance = new InterceptReq(
    '/manage_courses/course_instance/modify',
    'updateInstance'
  )
  static itcFetchUsersInstance = new InterceptReq(
    '/course_instance/fetch_users',
    'FetchUsersInstance'
  )
}

export default ModifyCourseInstanceItc
