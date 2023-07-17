import InterceptReq from '../../../../base/InterceptReq'

export default class ChangeLogItc {
  static itcGetManageStorageOverview = new InterceptReq(
    '/organization/manage_storage/overview/get',
    'GetManageStorageOverview'
  )
  static itcFetchChangeLogs = new InterceptReq(
    '/learning_admin/change_logs/fetch',
    'FetchChangeLogs'
  )
  static fetchChangeLogCourseAdmin = new InterceptReq(
    '/course_admin/change_logs/fetch',
    'FetchChangeLogCourseAdmin'
  )
}
