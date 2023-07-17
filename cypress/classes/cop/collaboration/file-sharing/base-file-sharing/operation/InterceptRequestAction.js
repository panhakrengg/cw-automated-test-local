import InterceptReq from '../../../../../base/InterceptReq'
import Field from '../../../../../constants/Field'

class InterceptRequestAction {
  static _itcFetchQuickAccess = new InterceptReq(
    '/file_sharing/quick_access/fetch',
    'FetchQuickAccess'
  )
  static _itcFetchFolderTree = new InterceptReq(
    '/file_sharing/fetch_folder_tree',
    'FetchFolderTree'
  )
  static _itcFetchFolderDetails = new InterceptReq(
    '/file_sharing/fetch_folder_details',
    'FetchFolderDetails'
  )
  static _itcFetchRepositorySize = new InterceptReq(
    '/file_sharing/fetch_repository_size',
    'FetchRepositorySize'
  )
  static _itcSaveNewFolder = new InterceptReq('/file_sharing/save_new_directory', 'SaveNewFolder')
  static _itcDelete = new InterceptReq('/file_sharing/delete', Field.DELETE)

  static _itcEditFolderInfo = new InterceptReq('/file_sharing/edit_folder_info', 'EditFolderInfo')

  static _itcMarkAsFavorite = new InterceptReq(
    '/file_sharing/mark_document_favorite',
    'MarkAsFavorite'
  )
  static _itcViewModeUpdate = new InterceptReq('/file_sharing/view_mode/update', 'ViewMode')
  static _itcSearchFileAndFolder = new InterceptReq(
    '/file_sharing/search_file_and_folder',
    'SearchFileAndFolder'
  )
  static _itcFetchFileVersion = new InterceptReq(
    '/file_sharing/file_version/get',
    'SearchFileAndFolder'
  )
  static _itcFetchPublicKey = new InterceptReq('/file_sharing/fetch_public_key', 'FetchPublicKey')
  static _itcFetchTrash = new InterceptReq('/file_sharing/trash/fetch', 'FetchTrash')
  static _itcSettingsFetch = new InterceptReq('/file_sharing/settings/fetch', 'SettingsFetch')
  static _itcCheckFolder = new InterceptReq('/file_sharing/check_folder', 'CheckFolder')
  static _itcModifyFileNote = new InterceptReq(
    '/file_sharing/file_version/change_log/modify', 'ModifyFileNote')
}

export default InterceptRequestAction
