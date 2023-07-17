import InterceptReq from '../../../../base/InterceptReq'

export default class ModifyCourseItc {
  static uploadTempFile = new InterceptReq('/manage_courses/temp_file/upload', 'UploadTempFile')
  static modifyCourse = new InterceptReq('/manage_course/course/modify', 'ModifyCourse')
  static fetchCourse = new InterceptReq('/manage_courses/fetch_course', 'FetchCourse')
}
