import InterceptReq from '../../../base/InterceptReq'

export default class ResourceItc {
  static fetchBreadcrumbFaci = new InterceptReq(
    '/facilitator_resources/breadcrumbs/fetch',
    'FetchBreadcrumbsFaci'
  )
  static fetchBreadcrumbLearner = new InterceptReq(
    '/learner_resource/breadcrumbs/fetch',
    'FetchBreadcrumbsLearner'
  )
  static deleteResourceManageCourse = new InterceptReq(
    '/manage_courses/resource/delete',
    'DeleteResourceManageCourse'
  )
  static fetchFaciResource = new InterceptReq('/facilitator_resource/fetch', 'FetchFaciResource')
  static fetchLearnerResource = new InterceptReq('/learner_resource/fetch', 'FetchLearnerResource')
  static uploadFileFaci = new InterceptReq('/facilitator_resource/upload_file', 'UploadFileFaci')
  static uploadFileLearner = new InterceptReq('/learner_resource/upload_file', 'UploadFileLearner')
}
