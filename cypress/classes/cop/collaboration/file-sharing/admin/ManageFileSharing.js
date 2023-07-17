import BaseFileSharing from '../base-file-sharing/BaseFileSharing'
import { SourceType } from '../base-file-sharing/FileSharingConstant'
import FileFolderOperation from '../base-file-sharing/operation/FileFolderOperation'
import InterceptRequestAction from '../base-file-sharing/operation/InterceptRequestAction'

class ManageFileSharing extends BaseFileSharing {
  constructor(copUrl) {
    super(copUrl)
    this.fileFolderOperation = new FileFolderOperation()
  }

  _createNewFolder(folderName) {
    this.fileFolderOperation._createNewFolder(folderName)
  }

  _deleteFileOrFolderViaThreedot(name, encryptOrRecycleBinEnable = false) {
    this.fileFolderOperation._deleteFileOrFolderViaThreedot(name, encryptOrRecycleBinEnable)
  }

  removeFileIfExist(name) {
    this.isFileExist(name)
    cy.get('@isFileExist').then((isFileExist) => {
      if (isFileExist) {
        this._deleteFileOrFolderViaThreedot(auOfficeFile)
      }
    })
  }

  _deleteFilesOrFoldersViaSelect(names, encryptOrRecycleBinEnable = false) {
    this.fileFolderOperation._deleteFileOrFolderViaSelect(names, encryptOrRecycleBinEnable)
  }

  _deleteFileOrFolderViaSelect(names, encryptOrRecycleBinEnable = false) {
    this.fileFolderOperation._deleteFileOrFolderViaSelect(names, encryptOrRecycleBinEnable)
    cy.wait(15000)
  }

  _deleteFilesOrFoldersViaSelectInRecycleBin(names = []) {
    this.fileFolderOperation._deleteFileOrFolderViaSelectInRecycleBin(names)
  }

  _clickFileViaThreedot(name) {
    this.fileFolderOperation._clickFileViaThreedot(name)
  }

  _viewFileViaThreedot(name) {
    this.fileFolderOperation._viewFileViaThreedot(name)
  }

  _editFileViaThreedot(name) {
    this.fileFolderOperation._editFileViaThreedot(name)
  }

  _uploadFiles(filesName) {
    this.fileFolderOperation._uploadFiles(filesName, SourceType.base)
  }

  uploadFileIfNotExist(fileName, path) {
    this.fileFolderOperation.uploadFileIfNotExist(fileName, path)
  }

  _newDocument(name = '', type = '') {
    this.fileFolderOperation._newDocument(name, type)
  }

  _renameFolder(oldName, newName) {
    this.fileFolderOperation._renameFolder(oldName, newName)
  }

  _markAsFavorite(fileOrFolderName) {
    this.fileFolderOperation._markAsFavorite(fileOrFolderName)
  }

  _removeFavorite(fileOrFolderName) {
    this.fileFolderOperation._removeFavorite(fileOrFolderName)
  }

  _revokeMarkAsFavorite(fileOrFolderName) {
    return this.fileFolderOperation._revokeMarkAsFavorite(fileOrFolderName)
  }

  _searchFileOrFolderByName(fileName, callback = () => {}) {
    super._getSearchFileOrFolderByName(fileName).then(() => {
      callback()
    })
  }

  _searchFileOrFolderInRecycleBinByName(fileName, callback = () => {}) {
    super._getSearchFileOrFolderByName(fileName, InterceptRequestAction._itcFetchTrash).then(() => {
      callback()
    })
  }

  _moveFilesFolderIntoACommunityFolder(originate, targetFolder) {
    this.fileFolderOperation._selectAll()
    this.fileFolderOperation._moveButton()
    this.fileFolderOperation._moveFilesFolderIntoACommunityFolder(originate, targetFolder)
  }

  _moveFilesFolderIntoAPlatformFolder(targetFolder) {
    this.fileFolderOperation._moveFilesFolderIntoAPlatformFolder(targetFolder)
  }

  _moveFileFromMostRecent(auOfficeFile) {
    this.fileFolderOperation.moveFileFromMostRecent(auOfficeFile)
  }

  _removeFilesIfExist(names) {
    names.forEach((name) => {
      this._removeFileIfExist(name)
    })
  }

  _removeFileIfExist(name) {
    this.fileFolderOperation._removeFileIfExist(name)
  }

  clickSetting() {
    InterceptRequestAction._itcSettingsFetch.set()
    cy.get('.border-left > .h-100').click()
    cy.get('.cec-card__main-content > div').last().as('settingBody')
    InterceptRequestAction._itcSettingsFetch.wait()
  }

  checkVaultFolder() {
    cy.checkboxByLabel('Enable Vault in Community Files folder').uncheck()
  }
}
export default ManageFileSharing
