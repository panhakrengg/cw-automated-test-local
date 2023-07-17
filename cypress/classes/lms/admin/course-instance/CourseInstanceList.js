import InterceptReq from '../../../base/InterceptReq'

class CourseInstanceList {
  itcFetchCourseInstance = new InterceptReq(
    '/manage_courses/fetch_course_instances',
    'FetchCourseInstance'
  )
}
export default CourseInstanceList
