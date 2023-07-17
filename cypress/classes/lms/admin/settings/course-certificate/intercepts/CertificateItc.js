import InterceptReq from '../../../../../base/InterceptReq'

export default class CertificateItc {
  static itcFetchInitialCertificate = new InterceptReq(
    '/setting/certificate/fetch_initial',
    'FetchInitialCertificate'
  )
  static itcFetchCertificate = new InterceptReq('/setting/certificate/fetch', 'FetchCertificate')
  static itcFetchAvailableLanguages = new InterceptReq(
    '/certificate/settings/available_languages/fetch',
    'FetchAvailableLanguages'
  )
  static itcFetchPlaceholders = new InterceptReq(
    '/certificate/settings/placeholders/fetch',
    'FetchPlaceholders'
  )
  static itchFetchCourseDetail = new InterceptReq(
    '/course_catalog/course/activities',
    'fetchCourseDetail'
  )
}
