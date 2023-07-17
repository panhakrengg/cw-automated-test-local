import InterceptAction from '../../../base/InterceptAction'
import InterceptReq from '../../../base/InterceptReq'

class ActivityLibraryItc {
  static itcFetchEditorConfig = new InterceptReq(
    '/course/activity/editor_config/fetch',
    'FetchEditorConfig'
  )
  static itcModifyActivityLibrary = new InterceptReq(
    '/activity_library/modify',
    'ModifyActivityLibrary'
  )
  static itcSearchActivityLibrary = new InterceptReq(
    '/activity_library/search',
    'SearchActivityLibrary'
  )
  static itcDeleteActivityLibrary = new InterceptReq(
    '/activity_library/delete',
    'DeleteActivityLibrary'
  )
  static itcCheckCatalogMoodle = new InterceptAction(
    '/activity_library/catalog_moodle_course/check_then_create',
    'CheckCatalogMoodle'
  )
  static itcUploadTempFile = new InterceptReq('/manage_courses/temp_file/upload', 'UploadTempFile')
  static itcCreateTempFolder = new InterceptReq(
    '/course_activity/temp_folder/create',
    'CreateTempFolder'
  )
  static itcFetchMoodleActivityUrl = new InterceptReq(
    '/activity_library/moodle_activity_url/fetch',
    'FetchMoodleActivityUrl'
  )
  static itcArchiveActivity = new InterceptReq('/activity_library/archive', 'ArchiveActivity')
  static itcFetchActivityLibraryDetails = new InterceptReq(
    '/activity_library/details/fetch',
    'FetchActivityLibraryDetails'
  )
  static itcYoutubeApi = {
    set() {
      cy.intercept('**/youtubei/v1/log_event**').as('youtubeAPI')
    },
    wait() {
      cy.wait('@youtubeAPI')
    },
  }
}

export default ActivityLibraryItc
