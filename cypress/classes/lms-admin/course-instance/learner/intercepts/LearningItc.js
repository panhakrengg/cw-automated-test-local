import InterceptReq from '../../../../base/InterceptReq'

class LearningItc {
  static fetchCourseCatalog = new InterceptReq('/course_catalog/search', 'fetchCourseCatalog')
}

export default LearningItc
