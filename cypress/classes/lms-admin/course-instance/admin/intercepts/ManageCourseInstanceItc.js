import InterceptReq from '../../../../base/InterceptReq'

class ManageCourseInstanceItc {
  static itcArchiveInstance = new InterceptReq(
    '/manage_courses/archive_instance',
    'archiveInstance'
  )

  static itcFetchCourseInstances = new InterceptReq(
    '/manage_courses/fetch_course_instances',
    'fetchCourseInstances'
  )

  static itcDeleteInstance = new InterceptReq('/manage_courses/delete_instance', 'deleteInstance')
  static itcFetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse ')
}

export default ManageCourseInstanceItc
