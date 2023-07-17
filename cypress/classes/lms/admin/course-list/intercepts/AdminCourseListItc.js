import InterceptReq from '../../../../base/InterceptReq'

export default class AdminCourseListItc {
  static fetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse ')
  static deleteCourse = new InterceptReq('/manage_courses/delete', 'DeleteCourse')
  static fetchCopInfoAdmin = new InterceptReq('/admin/fetch_cop_info', 'FetchCopInfoAdmin')
  static fetchCourseManageCourses = new InterceptReq(
    '/manage_courses/fetch_course',
    'FetchCourseManageCourses'
  )
  static fetchPermissionAdmin = new InterceptReq('/admin/permission/fetch', 'FetchPermissionAdmin')
  static removeSharedCourseAdmin = new InterceptReq(
    '/admin/shared_course/remove',
    'RemoveSharedCourseAdmin'
  )
  static searchSharedCourse = new InterceptReq('/admin/shared_courses/search', 'SearchSharedCourse')
}
