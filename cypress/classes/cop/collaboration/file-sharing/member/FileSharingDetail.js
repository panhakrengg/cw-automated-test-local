import BaseFileSharing from '../base-file-sharing/BaseFileSharing'
import { DropdownMenu, SourceType } from '../base-file-sharing/FileSharingConstant'
import FileFolderOperation from '../base-file-sharing/operation/FileFolderOperation'
import InterceptRequestAction from '../base-file-sharing/operation/InterceptRequestAction'
import Field from '../../../../constants/Field'

class FileSharingDetail extends BaseFileSharing {
  constructor(copUrl) {
    super(copUrl)
    this.fileFolderOperation = new FileFolderOperation()
  }

  _searchFileOrFolderByName(fileName, callback = () => {}) {
    super._getSearchFileOrFolderByName(fileName).then(() => {
      callback()
    })
  }

  _clickFileVersionsViaThreeDot(file) {
    InterceptRequestAction._itcFetchFileVersion.set()
    this.fileFolderOperation._clickFileOrFolderThreeDotBy(file, Field.VERSIONS)
    InterceptRequestAction._itcFetchFileVersion.wait()
  }

  _deleteFilesOrFoldersViaSelect(names) {
    this.fileFolderOperation._deleteFileOrFolderViaSelect(names)
  }

  _uploadInvalidFileThenRemoveIt(filesName) {
    this.fileFolderOperation._uploadFiles(filesName, SourceType.base, () => {
      super._invokeDeleteActionOnDropZone()
    })
  }

  _uploadInvalidFiles(filesName) {
    this._uploadInvalidFileThenRemoveIt(filesName)
  }

  _uploadFiles(filesName, path = SourceType.base, callback) {
    this.fileFolderOperation._uploadFiles(filesName, path, callback)
  }

  _uploadFilesInVaultFolder(filesName, path = SourceType.base, callback) {
    this.fileFolderOperation._uploadFilesInVaultFolder(filesName, path, callback)
  }

  _downloadBulkFiles(filesName) {
    this.fileFolderOperation._downloadBulkFiles(filesName)
  }

  _downloadFiles(filesName) {
    this.fileFolderOperation._downloadFiles(filesName)
  }

  _downloadFilesFromMostRecent(filesName) {
    this.fileFolderOperation._downloadFilesFromMostRecent(filesName)
  }

  _downloadFilesFromMostDownload(filesName) {
    this.fileFolderOperation._downloadFilesFromMostDownload(filesName)
  }

  _downloadFilesOrFoldersBySearchName(filesName) {
    this.fileFolderOperation._downloadFilesOrFoldersBySearchName(filesName)
  }

  _createNewFolder(folderName) {
    this.fileFolderOperation._createNewFolder(folderName)
  }

  _newDocument(name = '', type = '') {
    this.fileFolderOperation._newDocument(name, type)
  }

  _deleteFileOrFolderViaThreedot(name) {
    this.fileFolderOperation._deleteFileOrFolderViaThreedot(name)
  }

  _removeFileIfExist(name) {
    this.fileFolderOperation._removeFileIfExist(name)
  }

  _deleteLatestFileVersionByIndex(name) {
    this.fileFolderOperation._deleteLatestFileVersionByIndex(name)
  }

  addFileVersionNote(name, version, note) {
    this.fileFolderOperation.addFileVersionNote(name, version, note)
  }

  _clickNewDocumentButton() {
    cy.get('[name="btnNewDocument"] > .d-block > .d-none').click()
  }

  _initCreateNewDocument() {
    cy.swal2()
      .getSwal2Content()
      .within(($content) => {
        cy.wrap($content).find('input.form-control').as('documentNameInput')
        cy.wrap($content).btnConfirm(Field.CREATE).as('createDocumentButton')
      })
  }

  _clickCreateDocumentButton() {
    cy.get('@createDocumentButton').click()
  }

  _fillInDocumentName(name = '') {
    cy.get('@documentNameInput').type(name)
  }

  _fillInDocumentNameAndChangeType(name = '', type = '') {
    cy.get('@documentNameInput').clear().type(name)
    cy.swal2().within(($swal) => {
      cy.wrap($swal).clickCwDropdownItem(type)
    })
  }

  _viewFileViaThreedotInQuickAccess(name) {
    this.fileFolderOperation._viewFileViaThreedotInQuickAccess(name)
  }

  _viewFileViaThreedot(name) {
    this.fileFolderOperation._viewFileViaThreedot(name)
  }

  _searchInFolderName(file, callback = () => {}) {
    cy.logInTestCase('Visit file sharing and community detail')
    this._visitFileSharingPage()
    callback()

    cy.logInTestCase(`Search ${file} file`)
    this._searchFileOrFolderByName(`"${file}"`)
  }

  _viewFile(file) {
    cy.logInTestCase(`Verify view ${file} file`)
    this._viewFileViaThreedot(file)
    cy.wait('@getConfig', { timeout: 60000 })
  }

  _getAllTableRows() {
    cy.cwTable().within(() => {
      cy.getAllTableRows().as('rows')
    })
    return cy.get('@rows')
  }

  _selectAndClickMoveFile(fileOrFolderName) {
    InterceptRequestAction._itcCheckFolder.set()
    this.fileFolderOperation._selectFileOrFolder([fileOrFolderName])
    this.fileFolderOperation._moveButton()
    InterceptRequestAction._itcCheckFolder.wait()
  }

  _viewFileOrFolderDetailViaThreeDot(name) {
    this.fileFolderOperation._clickFileOrFolderThreeDotBy(name, DropdownMenu.details)
  }

  uploadFileNewVersion(
    fileName,
    differenceFileTypeName,
    path,
    isDifferenceFileType,
    callback = () => {}
  ) {
    this.fileFolderOperation.uploadFileNewVersion(
      fileName,
      differenceFileTypeName,
      path,
      isDifferenceFileType,
      callback
    )
  }

  uploadFileIfNotExist(fileName, path) {
    this.fileFolderOperation.uploadFileIfNotExist(fileName, path)
  }

  _clickFileViaThreedot(name) {
    this.fileFolderOperation._clickFileViaThreedot(name)
  }
}
export default FileSharingDetail
