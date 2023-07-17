import Field from '../../../../../constants/Field'
import FileSharingFilePathStub from '../../stub/FileSharingFilePathStub'
import BaseFileSharing from '../BaseFileSharing'
import { DropdownMenu } from '../FileSharingConstant'
import QuickAccessAction from '../QuickAccessAction'
import InterceptRequestAction from './InterceptRequestAction'
import OperationAction from './OperationAction'

class FileFolderOperation extends BaseFileSharing {
  constructor() {
    super()
  }

  _selectAll() {
    cy.cwTable()
    cy.getTableHeader(Field.NAME).minusCheckBox().click()
  }

  _createNewFolder(folderName) {
    OperationAction._clickOnNewFolderButton()
    cy.swal2().within(() => {
      cy.getElementByLabel('Folder Name*').type(folderName)
      InterceptRequestAction._itcSaveNewFolder.set()
      InterceptRequestAction._itcFetchFolderDetails.set()
      InterceptRequestAction._itcFetchFolderTree.set()
      cy.get(`button:contains("${Field.CREATE}")`).click()
      InterceptRequestAction._itcSaveNewFolder.wait()
      InterceptRequestAction._itcFetchFolderDetails.wait()
      InterceptRequestAction._itcFetchFolderTree.wait()
    })
  }

  #deleteFileOrFolderViaThreedot(name, callback = () => {}) {
    this._getFileOrFolderByName(name).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        cy.wrap($fileOrFolder).within(() => {
          this.#executeResult($fileOrFolder, callback)
        })
      }
    })
  }

  _clickFileOrFolderThreeDotBy(fileOrFolderName, option) {
    this._getFileOrFolderByName(fileOrFolderName).within(($fileOrFolder) => {
      cy.wrap($fileOrFolder).getThreedotsIcon().click()
      cy.wrap($fileOrFolder).clickDropdownName(option)
    })
  }

  #clickThreeDotView() {
    cy.getThreedotsIcon().click()
    cy.get('li > a:contains("View")')
      .invoke('attr', 'href')
      .then(($href) => {
        cy.visit($href)
      })
  }

  _viewFileViaThreedotInQuickAccess(name, index = 0) {
    this._getFileOrFolderByNameInQuickAccess(name)
      .eq(index)
      .within(() => {
        this.#clickThreeDotView()
      })
  }

  _viewFileViaThreedot(name, index = 0) {
    this._getFileOrFolderByName(name)
      .eq(index)
      .within(() => {
        cy.getThreedotsIcon().click()
        cy.get(`li > a:contains("${DropdownMenu.view}")`)
          .invoke('attr', 'href')
          .then(($href) => {
            cy.visit($href)
          })
      })
  }

  _editFileViaThreedot(name) {
    this.#deleteFileOrFolderViaThreedot(name, (entry) => {
      cy.getThreedotsIcon().click()
      cy.wrap(entry).clickDropdownName(DropdownMenu.edit)
    })
  }

  #clickOnFileVersionVaiThreedot(name, callback) {
    super._getFileOrFolderByName(name).then(($file) => {
      if ($file !== null) {
        InterceptRequestAction._itcFetchFileVersion.set()
        OperationAction._clickDropdownName($file, DropdownMenu.versions)
        InterceptRequestAction._itcFetchFileVersion.wait()
        callback()
      }
    })
  }

  getAvailableFileVersions(name, callback = () => {}) {
    this.#clickOnFileVersionVaiThreedot(name, () => {
      cy.swal2().within(() => {
        cy.getSwal2Content()
          .get(`.file-version-item > ul li.list-group-item`)
          .then(($elements) => {
            callback($elements)
          })
        cy.getSwal2ButtonHolder().find('.btn-primary').click()
      })
    })
  }

  getBaseFileVersionActionByIndex(name, index = 0, callback) {
    this.getAvailableFileVersions(name, ($elements) => {
      if ($elements.length !== 1) {
        /* prevent delete the latest file version */
        cy.wrap($elements)
          .eq(index)
          .within(($element) => {
            callback($element, $elements.length)
          })
      }
    })
  }

  getBaseFileVersionActionByVersionName(name, version, callback) {
    this.getAvailableFileVersions(name, ($elements) => {
      cy.wrap($elements)
        .find(`.list-group-title:contains(${version})`)
        .parents('.list-group-item')
        .within(($element) => {
          callback($element, $elements.length)
        })
    })
  }

  _deleteLatestFileVersionByIndex(name, version) {
    this.getBaseFileVersionActionByIndex(name, version, ($element) => {
      OperationAction._clickDropdownName($element, DropdownMenu.deleteVersion)
    })
  }

  #modifyFileNote() {
    InterceptRequestAction._itcModifyFileNote.set()
    InterceptRequestAction._itcFetchFileVersion.set()
    cy.clickButtonByName(Field.SAVE)
    InterceptRequestAction._itcFetchFileVersion.wait()
    InterceptRequestAction._itcModifyFileNote.wait()
  }

  addFileVersionNote(name, version, note) {
    this.getBaseFileVersionActionByVersionName(name, version, ($element) => {
      OperationAction._isActionExist($element, DropdownMenu.addNote).then(($actionExist) => {
        if ($actionExist) {
          cy.getTextareaByPlaceholder(DropdownMenu.addNote).clear().type(`${note}`)
          this.#modifyFileNote()
        }
      })
    })
  }

  _clickFileViaThreedot(name) {
    this._getFileOrFolderByName(name).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        cy.wrap($fileOrFolder).within(() => {
          cy.getThreedotsIcon().click()
        })
      }
    })
  }

  _deleteFileOrFolderViaThreedot(name, encryptOrRecycleBinEnable = false) {
    this.#deleteFileOrFolderViaThreedot(name, (entry) => {
      cy.getThreedotsIcon().first().click()
      cy.wrap(entry).clickDropdownName(Field.DELETE)
      if (!encryptOrRecycleBinEnable) cy.wrap(entry).swal2Confirm(Field.YES_DELETE).click()
    })
  }

  _deleteFileOrFolderViaSelect(names = [], encryptOrRecycleBinEnable = false) {
    this._selectFileOrFolder(names)
    this._clickOnDeleteButton(() => {
      cy.get('@deleteButton').click({ force: true })
      cy.waitLoadingOverlayNotExist()
      if (!encryptOrRecycleBinEnable) cy.swal2Confirm(Field.YES_DELETE).click()
    })
  }

  _deleteFileOrFolderViaSelectInRecycleBin(names = []) {
    this._selectFileOrFolder(names)
    cy.get('button[name="btnDelete"]')
      .as('deleteButton')
      .invoke('attr', 'disabled')
      .then(($disable) => {
        if (!$disable) {
          InterceptRequestAction._itcFetchTrash.set()
          cy.get('@deleteButton').click()
          cy.swal2Confirm(Field.YES_DELETE).click()
          InterceptRequestAction._itcFetchTrash.wait()
        }
      })
  }

  _moveButton() {
    cy.get('[name="btnMove"] > .d-block').click()
  }

  _renameFolder(oldName, newName) {
    this._getFileOrFolderByName(oldName).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        cy.wrap($fileOrFolder).within(() => {
          cy.getThreedotsIcon().click()
          cy.wrap($fileOrFolder).clickDropdownName(DropdownMenu.rename)
          cy.wrap($fileOrFolder)
            .swal2()
            .within(() => {
              InterceptRequestAction._itcEditFolderInfo.set()
              InterceptRequestAction._itcFetchFolderDetails.set()
              InterceptRequestAction._itcFetchFolderTree.set()
              cy.get('input[id="edit-name"]').clear().type(newName)
              cy.get(`button:contains("${Field.SAVE}")`).click()
              InterceptRequestAction._itcEditFolderInfo.wait()
              InterceptRequestAction._itcFetchFolderDetails.wait()
              InterceptRequestAction._itcFetchFolderTree.wait()
              cy.wait(1000)
            })
        })
      }
    })
  }

  _clickOnDeleteButton(callback = () => {}) {
    cy.get('button[name="btnDelete"]')
      .as('deleteButton')
      .invoke('attr', 'disabled')
      .then(($disable) => {
        if (!$disable) {
          this.#executeResult(undefined, callback)
        }
      })
  }

  _selectFileOrFolder(names) {
    names.forEach((name) => {
      this._getFileOrFolderByName(name).then(($fileOrFolder) => {
        if ($fileOrFolder) {
          cy.wrap($fileOrFolder).each((subject) => {
            cy.wrap(subject).within(() => {
              cy.get('input[type="checkbox"]').check()
            })
          })
        }
      })
    })
  }

  _newDocument(name = '', type = '') {
    cy.get('[name="btnNewDocument"] > .d-block > .d-none').click()
    cy.swal2()
      .getSwal2Content()
      .within(($content) => {
        cy.wrap($content).find('input.form-control').type(name)
        cy.wrap($content).clickCwDropdownItem(type)
        cy.wrap($content).btnConfirm(Field.CREATE).click()
        cy.window().then((win) => {
          cy.stub(win, 'open')
            .callsFake((url, target) => {
              expect(target).to.contain('_blank')
              return win.open.wrappedMethod.call(win, url, '_self')
            })
            .as('newDocumentUrl')
        })
      })
  }

  _uploadFilesInVaultFolder(filesName, filePath, callback = () => {}) {
    InterceptRequestAction._itcFetchPublicKey.set()
    OperationAction._clickOnNewUploadButton()
    InterceptRequestAction._itcFetchPublicKey.wait()
    this.#executeUploadFile(filesName, filePath, false, callback)
  }

  _uploadFiles(filesName, filePath, callback = () => {}) {
    OperationAction._clickOnNewUploadButton()
    this.#executeUploadFile(filesName, filePath, false, callback)
  }

  #executeUploadFile(filesName, filePath, isDifferenceFileType, callback = () => {}) {
    this.#getFiles(filesName, filePath, (filesProperties) => {
      const filePaths = filesProperties.map((file) => file.path)
      const existingFiles = filesProperties.filter((file) => file.exist)
      this.#baseUploadFile(filePaths, existingFiles, isDifferenceFileType, (entry) => {
        callback(entry)
      })
    })
  }

  #baseUploadFile(filesToUpload, existingFiles, isDifferenceFileType, callback = () => {}) {
    cy.swal2().then(() => {
      cy.get('input[type="file"]')
        .eq(0)
        .selectFile(filesToUpload, { force: true })
        .then(($response) => {
          if ($response[0].files.length === filesToUpload.length) {
            this.#uploadResponse(existingFiles, isDifferenceFileType, callback)
          }
        })
    })
  }

  #uploadResponse(existingFiles, isDifferenceFileType, callback = () => {}) {
    if (existingFiles.length || isDifferenceFileType) {
      callback(true)
    } else {
      InterceptRequestAction._itcFetchFolderDetails.set()
      InterceptRequestAction._itcFetchRepositorySize.set()
      callback(false)
      cy.getSwal2ButtonHolder().contains('button', Field.CLOSE).click()
      InterceptRequestAction._itcFetchFolderDetails.wait()
      InterceptRequestAction._itcFetchRepositorySize.wait()
    }
  }

  #executeResult(entry, callback = () => {}) {
    InterceptRequestAction._itcDelete.set()
    InterceptRequestAction._itcFetchFolderDetails.set()
    InterceptRequestAction._itcFetchFolderTree.set()
    InterceptRequestAction._itcFetchRepositorySize.set()
    callback(entry)
    InterceptRequestAction._itcDelete.wait()
    InterceptRequestAction._itcFetchFolderDetails.wait()
    InterceptRequestAction._itcFetchFolderTree.wait()
    InterceptRequestAction._itcFetchRepositorySize.wait()
  }

  #getFiles(filesName = [], filePath, callback = () => {}) {
    let fileProperties = []
    filesName.forEach((fileName) => {
      let file = { name: '', exist: false }
      this.#isFileExist(fileName).then((isFileExist) => {
        file.exist = isFileExist
        file.name = fileName
        file.path = FileSharingFilePathStub.getFilePath(filePath) + fileName
        fileProperties.push(file)
      })
    })
    cy.wrap(null).then(() => {
      callback(fileProperties)
    })
  }

  _markAsFavorite(fileOrFolderName) {
    InterceptRequestAction._itcMarkAsFavorite.set()
    super._getFileOrFolderByName(fileOrFolderName).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        OperationAction._clickDropdownName($fileOrFolder, DropdownMenu.markAsFavorite)
      }
    })
    InterceptRequestAction._itcMarkAsFavorite.wait()
  }

  _removeFavorite(fileOrFolderName) {
    InterceptRequestAction._itcMarkAsFavorite.set()
    super._getFileOrFolderByName(fileOrFolderName).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        OperationAction._clickDropdownName($fileOrFolder, DropdownMenu.removeFavorite)
      }
    })
    InterceptRequestAction._itcMarkAsFavorite.wait()
  }

  _revokeMarkAsFavorite(fileOrFolderName) {
    super._getFileOrFolderByName(fileOrFolderName).then(($fileOrFolder) => {
      OperationAction._isActionExist($fileOrFolder, DropdownMenu.removeFavorite).then(
        ($actionExist) => {
          if (!$actionExist) {
            this._markAsFavorite(fileOrFolderName)
          }
        }
      )
    })
  }

  uploadFileNewVersion(
    fileName,
    differenceFileTypeName,
    path,
    isDifferenceFileType,
    callback = () => {}
  ) {
    super._getFileOrFolderByName(fileName).then(($fileOrFolder) => {
      if ($fileOrFolder) {
        OperationAction._clickDropdownName($fileOrFolder, DropdownMenu.uploadNewVersion)
        this.#executeUploadFile([differenceFileTypeName], path, isDifferenceFileType, callback)
      }
    })
  }

  #downloadFileFromMostDownload(name) {
    new QuickAccessAction()._getMostDownloadedByName(name).then(($item) => {
      OperationAction._clickDropdownName($item, DropdownMenu.download)
    })
  }

  #downloadFileFromMostRecent(name) {
    new QuickAccessAction()._getMostRecentByName(name).then(($item) => {
      OperationAction._clickDropdownName($item, DropdownMenu.download)
    })
  }

  moveFileFromMostRecent(name) {
    new QuickAccessAction()._getMostRecentByName(name).within(($item) => {
      OperationAction._clickDropdownName($item, DropdownMenu.move)
    })
  }

  _downloadFilesFromMostRecent(filesName) {
    filesName.forEach((fileName) => {
      this.#downloadFileFromMostRecent(fileName)
    })
  }

  _downloadFilesFromMostDownload(filesName) {
    filesName.forEach((fileName) => {
      this.#downloadFileFromMostDownload(fileName)
    })
  }

  _downloadFile(fileName) {
    super
      ._getFileOrFolderByName(fileName)
      .last()
      .then(($fileOrFolder) => {
        if ($fileOrFolder) {
          OperationAction._clickDropdownName($fileOrFolder, DropdownMenu.download)
        }
      })
  }

  _downloadFiles(filesName) {
    filesName.forEach((fileName) => {
      this._downloadFile(fileName)
    })
  }

  _downloadFilesOrFoldersBySearchName(filesName) {
    const inputText = filesName[0].split('.doc')
    this._getSearchFileOrFolderByName(inputText[0]).then(() => {
      this._downloadFiles(filesName)
    })
  }

  _downloadBulkFiles() {
    this._selectAll()
    OperationAction._clickOnDownloadButton()
  }

  _moveFilesFolderIntoAPlatformFolder(targetFolder) {
    super._expandPlatformFolderInMovePopup()
    cy.wrap(false).as('isMove')
    cy.get('@moveFolderTree').within(() => {
      this._getFolderTree(targetFolder).click()
      cy.getSwal2ButtonHolder().find('.btn-primary').click()
      InterceptRequestAction._itcFetchFolderDetails.wait()
      cy.wrap(true).as('isMove')
    })
  }

  _moveFilesFolderIntoACommunityFolder(originate, targetFolder) {
    super._expandCommunityFilesFolderInMovePopup()
    cy.wrap(false).as('isMove')
    cy.get('@moveFolderTree').within(() => {
      this._expandFolderTree(originate)
      cy.get('@expand').scrollIntoView().click()
      this._getFolderTree(targetFolder).click()
      cy.getSwal2ButtonHolder().find('.btn-primary').click()
      InterceptRequestAction._itcFetchFolderDetails.wait()
      cy.wrap(true).as('isMove')
    })
  }

  _removeFileIfExist(name) {
    this.#isFileExist(name).then((isFileExist) => {
      if (isFileExist) {
        this._deleteFileOrFolderViaThreedot(name)
      }
    })
  }

  uploadFileIfNotExist(fileName, path) {
    this.#isFileExist(fileName).then((isFileExist) => {
      if (!isFileExist) {
        this._uploadFiles([fileName], path)
      }
    })
  }

  #isFileExist(name) {
    cy.wrap(false).as('isFileExist')
    cy.waitLoadingOverlayNotExist()
    cy.get('div.file-sharing-details').within(($fileSharingDetails) => {
      if ($fileSharingDetails.find(`tbody tr td:contains("${name}")`).length) {
        cy.wrap(true).as('isFileExist')
      }
    })
    return cy.get('@isFileExist')
  }

  _getFileOrFolderForSortByName(callback = () => {}) {
    this.#getFileAndFolderName()
    cy.get('@aliasEntries').then(($titles) => {
      this.#separateFileOrFolderForSort($titles, '.', callback)
    })
  }

  _getFileOrFolderForSortBySize(callback = () => {}) {
    this.#getFileOrFolderSize()
    cy.get('@aliasEntries').then(($titles) => {
      this.#separateFileOrFolderForSort($titles, '--', callback)
    })
  }

  #getFileOrFolderSize() {
    this.#invokeFileOrFolderEntry(($fileSharingDetails) => {
      this.#invokeFileOrFolderSize($fileSharingDetails)
    })
  }

  #getFileAndFolderName() {
    this.#invokeFileOrFolderEntry(($fileSharingDetails) => {
      this.#invokeFileOrFolderName($fileSharingDetails)
    })
  }

  #separateFileOrFolderForSort($entries, separator, callback = () => {}) {
    let fileEntries = []
    let folderEntries = []
    $entries.forEach((entry) => {
      if (entry.includes(separator)) {
        fileEntries.push(entry.trim())
      } else {
        folderEntries.push(entry.trim())
      }
    })
    callback(fileEntries, folderEntries)
  }

  #invokeFileOrFolderSize($fileSharingDetails) {
    let entries = []
    cy.wrap($fileSharingDetails)
      .cwTable()
      .row()
      .each(($element, $index) => {
        cy.wrap($element)
          .getTableColumn($index, 1)
          .invoke('text')
          .then(($text) => {
            entries.push($text)
            cy.wrap(entries).as('aliasEntries')
          })
      })
  }

  #invokeFileOrFolderName($fileSharingDetails) {
    let entries = []
    cy.wrap($fileSharingDetails)
      .cwTable()
      .row()
      .each(($element, $index) => {
        cy.wrap($element)
          .getTableColumn($index, 0, 'a')
          .invoke('attr', 'title')
          .then(($text) => {
            entries.push($text)
            cy.wrap(entries).as('aliasEntries')
          })
      })
  }

  #invokeFileOrFolderEntry(callback = () => {}) {
    cy.wrap(Array).as('aliasEntries')
    cy.get('div.file-sharing-details').within(($fileSharingDetails) => {
      callback($fileSharingDetails)
    })
    return cy.get('@aliasEntries')
  }
}

export default FileFolderOperation
