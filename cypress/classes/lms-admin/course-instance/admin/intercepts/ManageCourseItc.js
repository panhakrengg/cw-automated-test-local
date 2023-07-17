import InterceptReq from '../../../../base/InterceptReq'

class ManageCourseItc {
  static itcFetchManageCourse = new InterceptReq('/manage_courses/fetch', 'FetchManageCourse')
}

export default ManageCourseItc
