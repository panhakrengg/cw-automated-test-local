import InterceptReq from '../../../../base/InterceptReq'

class CourseDetailsItc {
  static itcFetchTermAndCondition = new InterceptReq(
    '/course_catalog/course_schedule/term_and_condition',
    'FetchTermAndCondition'
  )
}

export default CourseDetailsItc
