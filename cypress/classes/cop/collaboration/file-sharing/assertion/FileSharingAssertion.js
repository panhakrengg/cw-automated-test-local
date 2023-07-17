import Field from '../../../../constants/Field'
import DateFormat from '../../../../format-collections/DateFormat'
import GlobalSearch from '../../../../global-search/GlobalSearch'
import DateUtil from '../../../../utilities/DateUtil'
import BaseFileSharing from '../base-file-sharing/BaseFileSharing'
import { DropdownMenu, RootFolderType } from '../base-file-sharing/FileSharingConstant'
import QuickAccessAction from '../base-file-sharing/QuickAccessAction'
import OperationAction from '../base-file-sharing/operation/OperationAction'

class FileSharingAssertion extends BaseFileSharing {
  constructor() {
    super()
    this.quickAccessAction = new QuickAccessAction()
  }

  _expectNotSeeFolderInSidebar(folderName) {
    this._getFileSharingSidebar(() => {
      cy.get(`ul > li:contains("${folderName}")`).should('not.exist')
    })
  }

  _expectNotSeeFileFolderOnGlobalSearch(parentFolderName, childFolderName) {
    const globalSearch = new GlobalSearch()
    globalSearch.search(parentFolderName)
    globalSearch.clickFileTab()
    const folderNames = [parentFolderName, childFolderName]
    folderNames.forEach((folderName) => {
      globalSearch.expectedNotFoundFileFolderInGlobalSearch(folderName)
    })
  }

  _expectToSeeFileOrFolder(name) {
    super._getFileOrFolderByName(name).then(($fileOrFolder) => {
      if ($fileOrFolder !== null) {
        cy.wrap($fileOrFolder).should('be.visible')
      }
    })
  }

  _expectToSeeFilesOrFolders(filesName = []) {
    filesName.forEach((filename) => {
      this._expectToSeeFileOrFolder(filename)
    })
  }

  _expectNotToSeeFileOrFolder(name) {
    super._getFileOrFolderByName(name, ($tbody) => {
      cy.wrap($tbody).get(`tr:contains("${name}")`).should('not.exist')
    })
  }

  _expectNotToSeeFilesOrFolders(filesName) {
    filesName.forEach((filename) => {
      this._expectNotToSeeFileOrFolder(filename)
    })
  }

  _expectToSeeFolderInFolderTree(name) {
    this._getFolderTree(name).should('be.visible')
  }

  _expectToSeeEmptyState(name) {
    const capitalLatter = name.charAt(0).toUpperCase() + name.slice(1)
    cy.get('.text-dark')
      .parent('.cec-card__toolbar')
      .within(() => {
        cy.getElementWithLabel('Search result', 'div')
          .should('have.css', 'text-transform', 'capitalize')
          .invoke('text')
          .then((text) => {
            expect(text).to.contain(`Search result : ${name} (0)`)
          })
      })
    cy.get('.empty-state').within(($empty) => {
      cy.wrap('$empty').hasSvgIcon()
      cy.expectElementWithLabelVisible('Sorry, no result found.', 'p')
    })
  }

  _expectNotToSeeFileFolderThreedotOption(fileOrFolderName, options) {
    super
      ._getFileOrFolderByName(fileOrFolderName)
      .first()
      .then(($fileOrFolder) => {
        this.#expectNotToSeeThreedotOption($fileOrFolder, options)
      })
  }

  _expectNotToSeeFileFolderThreedotOptions(fileOrFolderName, options = []) {
    super
      ._getFileOrFolderByName(fileOrFolderName)
      .first()
      .then(($fileOrFolder) => {
        this.#expectNotToSeeThreedotOption($fileOrFolder, options)
      })
  }

  _expectHaveThreedotOptions(fileOrFolderName, options = []) {
    super
      ._getFileOrFolderByName(fileOrFolderName)
      .first()
      .then(($fileOrFolder) => {
        this.#expectToSeeThreedotOption($fileOrFolder, options)
      })
  }

  _expectEncryptedFileNotHaveThreedotOptions(fileOrFolderName, options = []) {
    super
      ._getFileOrFolderByName(fileOrFolderName)
      .last()
      .then(($fileOrFolder) => {
        this.#expectNotToSeeThreedotOption($fileOrFolder, options)
      })
  }

  _expectEncryptFileHaveThreedotOptions(fileOrFolderName, options = []) {
    super
      ._getFileOrFolderByName(fileOrFolderName)
      .last()
      .then(($fileOrFolder) => {
        this.#expectToSeeThreedotOption($fileOrFolder, options)
      })
  }

  _expectVaultHaveThreedotOption(
    options = [DropdownMenu.copyLink, DropdownMenu.markAsFavorite, DropdownMenu.details]
  ) {
    super._getFileOrFolderByName(RootFolderType.vault).then(($fileOrFolder) => {
      this.#expectToSeeThreedotOption($fileOrFolder, options)
    })
  }

  _expectCannotRenameFileOrFolder(fileOrFolderName) {
    super._getFileOrFolderByName(fileOrFolderName).then(($fileOrFolderName) => {
      OperationAction._clickDropdownName($fileOrFolderName, DropdownMenu.rename)
      cy.swal2().within(() => {
        cy.get('#edit-name').should('be.disabled').closeSwal2()
      })
    })
  }

  _expectToSeeVaultDetail(folderInfo) {
    super._getFileOrFolderByName(RootFolderType.vault).then(($fileOrFolderName) => {
      OperationAction._clickDropdownName($fileOrFolderName, DropdownMenu.details)
      cy.swal2().within(() => {
        cy.get('#view-name-wrapper p').should('contain.text', RootFolderType.vault)
        if (folderInfo) {
          cy.get('.file-detail > .row')
            .first()
            .get('.col-sm-9 p')
            .should('contain.text', folderInfo.location)
          cy.get('.file-detail > .row')
            .last()
            .get('.col-sm-9 p strong')
            .should('contain.text', folderInfo.createdBy)
        }
      })
    })
  }

  _expectToSeeDownloadedFile(fileName) {
    cy.verifyDownload(fileName)
  }

  _expectToSeeDownloadedFiles(filesName) {
    filesName.forEach((fileName) => {
      this._expectToSeeDownloadedFile(fileName)
    })
  }

  _expectToSeeDownloadedBulkAttachment() {
    const currentDate = new DateUtil().getCurrentDate(DateFormat.DOWNLOAD_ATTACHMENT_DATE_FORMAT)
    const downloadFolderName = `download ${currentDate}.zip`
    cy.verifyDownload(downloadFolderName, { timeout: 60000 })
  }

  _expectToSeeCorrectTableRows(rowNumber) {
    cy.cwTable().row().should('have.length', rowNumber)
  }

  _expectToSeeBreadcrumb(baseFoldersName) {
    let breadcrumbPath = ''
    cy.wrap(null).as('breadcrumb')
    cy.get('.text-dark.text-capitalize a').each(($element) => {
      cy.wrap($element)
        .invoke('attr', 'title')
        .then(($title) => {
          breadcrumbPath += $title.trim().concat('/')
          cy.wrap(breadcrumbPath).as('breadcrumb')
        })
    })
    let actualBreadcrumbPath = ''
    cy.get('@breadcrumb').then(($breadcrumb) => {
      baseFoldersName.forEach((folderName) => {
        actualBreadcrumbPath += folderName.concat('/')
      })
      expect(actualBreadcrumbPath).to.include($breadcrumb)
    })
  }

  _expectEditMenuNotExist() {
    cy.get('@cwThreeDotsIcon').get('ul.dropdown-menu').should('not.contain.text', Field.EDIT)
  }

  _expectNewDocumentNotExist() {
    cy.get('[name="btnNewDocument"] > .d-block > .d-none').should('not.exist')
  }

  _expectShowGrid() {
    super._ifTableListExist().then(($isTableListExist) => {
      expect($isTableListExist).not.to.be.true
    })
    super._ifGridListExist().then(($isGridListExist) => {
      expect($isGridListExist).to.be.true
    })
  }

  _expectToSortFileOrFolderNameByASC(operation) {
    operation._getFileOrFolderForSortByName((fileTitles, folderTitles) => {
      cy.wrap(fileTitles).expectSortAscending()
      cy.wrap(folderTitles).expectSortAscending()
    })
  }

  _expectToSortFileOrFolderNameByDESC(operation) {
    operation._getFileOrFolderForSortByName((fileTitles, folderTitles) => {
      cy.wrap(fileTitles).expectSortDescending()
      cy.wrap(folderTitles).expectSortDescending()
    })
  }

  _expectToSortFileOrFolderSizeByASC(operation) {
    operation._getFileOrFolderForSortBySize((fileTitles, folderTitles) => {
      cy.wrap(folderTitles).expectByteSortAscending()
    })
  }

  _expectToSortFileOrFolderSizeByDESC(operation) {
    operation._getFileOrFolderForSortBySize((fileTitles, folderTitles) => {
      cy.wrap(folderTitles).expectByteSortDescending()
    })
  }

  expectVaultFolderExist() {
    cy.get('table.cw-table > tbody > tr')
      .find(`a:contains("${RootFolderType.vault}")`)
      .within(($folderWithIcon) => {
        cy.wrap($folderWithIcon).hasSvgIcon()
      })
  }

  _expectToSeeEmptyResult() {
    cy.get('button[name="btnRestore"]').isDisabled()
    cy.get('button[name="btnDelete"]').isDisabled()
    cy.get('.empty-state').within(() => {
      cy.expectElementWithLabelVisible('Sorry, no result found.', 'p')
    })
  }

  _expectToSeePopupExistingFileAlert() {
    cy.swal2().within(($popup) => {
      cy.getSwal2Header().should('contain.text', 'Existing file')
      cy.wrap($popup)
        .getSwal2ButtonHolder()
        .within(() => {
          cy.expectButtonWithLabelAndEnabled(Field.KEEP_IT_SEPARATE)
          cy.expectButtonWithLabelAndEnabled(Field.YES_UPLOAD)
        })
    })
  }

  _expectToSeeMultiFile(name) {
    super._getFileOrFolderByName(name, ($file) => {
      cy.wrap($file).should('have.length.at.least', 1)
    })
  }

  _expectToSeeNewFileVersion(operation, name, index) {
    operation.getBaseFileVersionActionByIndex(name, index, ($element, length) => {
      cy.wrap($element).get('.list-group-title').should('contain.text', 'Version '.concat(length))
      cy.wrap($element).expectElementWithLabelVisible('default', 'span.badge')
    })
  }

  expectToSeeEnableVault() {
    cy.checkboxByLabel('Enable Vault in Community Files folder').should('be.visible')
  }

  expectToSeeWarningPrompt() {
    cy.get('@settingBody').verifySwal2Confirmation(
      'Disable Vault Folder',
      'The files in the Vault folder will be permanently deleted.',
      Field.YES_DISABLE,
      Field.CANCEL
    )
  }

  hasError(errorMessage) {
    cy.swal2().within(() => {
      cy.get('.has-error')
        .should('exist')
        .within(() => {
          cy.get('.form-validator-stack').should('have.text', errorMessage).and('be.visible')
        })
    })
  }

  hasNotError() {
    cy.swal2().within(() => {
      cy.get('.has-error').should('not.exist')
    })
  }

  expectOnlyOfficeShowErrorIfFileExist() {
    this.hasError('File name already exists in this folder.')
    cy.get('@createDocumentButton').isDisabled()
  }

  expectOnlyOfficeNotShowErrorIfFileExist() {
    this.hasNotError()
  }

  expectOnlyOfficeShowFieldRequired() {
    this.hasError('This field is required.')
    cy.get('@createDocumentButton').isDisabled()
  }

  expectShowOnlyOfficeDoc(name) {
    cy.get('iframe')
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .within(($body) => {
        cy.wrap($body).find('#viewport').should('exist')
        // TODO: Remove when local office upgrade
        if (this.env.isLocal()) {
          cy.wrap($body).find('#box-doc-name').should('have.text', name).and('be.visible')
        } else {
          cy.wrap($body).find('input#rib-doc-name').should('have.value', name).and('be.visible')
        }
        cy.wrap($body)
          .find('#id_main_view > #id_viewer, #ws-canvas-outer > #ws-canvas')
          .should('be.visible')
      })
  }

  expectedEncryptedFileThreeDot(file) {
    cy.logInTestCase('Verify threedot for encrypted file')
    this._expectEncryptFileHaveThreedotOptions(file, [DropdownMenu.download])
    this._expectEncryptedFileNotHaveThreedotOptions(file, [
      DropdownMenu.view,
      DropdownMenu.versions,
    ])
  }

  expectShowStorageAndBandwidthMessageIsVisible() {
    cy.expectElementWithLabelVisible('Notify me when storage/outbound limit reaches 90%', 'span')
      .siblings('input')
      .should('be.visible')
    cy.expectElementWithLabelVisible(
      'Disable web downloads when outbound limit reaches 90%',
      'span'
    )
      .siblings('input')
      .should('be.visible')
  }

  expectNoFolderShowInMovePopup(folderNames = []) {
    cy.swal2()
      .getSwal2Content()
      .within(($swal2Content) => {
        folderNames.forEach((folderName) => {
          cy.wrap($swal2Content).expectElementWithLabelNotExist(folderName, 'p')
        })
      })
  }

  saveButtonEnableAfterEdit() {
    cy.get('.form-group')
      .last()
      .within(($form) => {
        cy.wrap($form).typeInTextarea(Field.UPDATE)
      })
    cy.get('button[type="button"]').isEnabled()
  }

  #expectToSeeDetail(details = {}, isOwner) {
    cy.swal2().within(($swal2) => {
      cy.wrap($swal2).getSwal2Header(Field.DETAILS)

      cy.get('#view-name-wrapper').within(() => {
        cy.expectElementWithLabelVisible(Field.NAME, 'label')
        cy.expectElementWithLabelVisible(details.name, 'p')
      })

      cy.expectElementWithLabelVisible(Field.DESCRIPTION, 'label')
      const description = cy.get('#edit-description')
      isOwner ? description.isEnabled() : description.isDisabled()
      if (details.description) {
        cy.expectElementWithLabelVisible(details.description, '#edit-description')
      }

      cy.expectElementWithLabelVisible(Field.LOCATION, 'p')
      cy.expectElementWithLabelVisible(details.location, 'strong')
    })
  }

  expectToShowVaultFolderDetail(details = {}, isOwner = true) {
    cy.logInTestCase('expectToShowVaultFolderDetail')
    this.#expectToSeeDetail(details, isOwner)
    cy.swal2().within(($swal2) => {
      cy.expectElementWithLabelVisible(details.createdBy, 'strong')
      cy.expectElementWithLabelVisible(details.createdDate[this.prefix], 'p')
      if (isOwner) this.saveButtonEnableAfterEdit()
      cy.wrap($swal2).closeSwal2()
    })
  }

  expectToShowVaultFileDetail(details = {}, isOwner = true) {
    cy.logInTestCase('expectToShowVaultFileDetail')
    this.#expectToSeeDetail(details, isOwner)
    cy.swal2().within(($swal2) => {
      cy.expectElementWithLabelVisible(Field.VIEWS, 'p')
      cy.getElementWithLabel(Field.VIEWS, 'p')
        .parent()
        .siblings('div.col-xs-6')
        .within(() => {
          cy.get('p > strong')
            .invoke('text')
            .then(($text) => {
              expect(parseInt($text)).to.greaterThan(0)
            })
        })

      cy.expectElementWithLabelVisible(Field.CONTENT_TYPE, 'p')
      cy.expectElementWithLabelVisible(details.contentType, 'strong')

      cy.expectElementWithLabelVisible(Field.SIZE, 'p')
      cy.expectElementWithLabelVisible(details.size, 'strong')

      cy.expectElementWithLabelVisible(Field.UPLOAD_BY, 'p')
      cy.expectElementWithLabelVisible(details.uploadedBy, 'strong')
      cy.expectElementWithLabelVisible(details.uploadedDate[this.prefix], 'p')

      cy.expectElementWithLabelVisible(Field.MODIFY_BY, 'p')
      cy.expectElementWithLabelVisible(details.modifiedBy, 'strong')
      cy.expectElementWithLabelVisible(details.modifiedDate[this.prefix], 'p')

      if (isOwner) this.saveButtonEnableAfterEdit()
      cy.wrap($swal2).closeSwal2()
    })
  }

  expectToSeeDifferenceFileTypePopup() {
    cy.swal2().within(() => {
      cy.getSwal2Header().should('contain.text', 'Different file type')
      cy.getSwal2Content().within(() => {
        cy.expectElementWithLabelVisible(
          'Please select a file with the same type as the previous version',
          '.text-black'
        )
      })
    })
  }

  #expectNotToSeeThreedotOption($wrapper, options) {
    cy.wrap($wrapper).within(() => {
      cy.getThreedotsIcon().click()
      cy.getDropdownList().each(($item) => {
        cy.wrap($item)
          .invoke('text')
          .then(($text) => {
            if ($text.trim() !== '') {
              expect(options).to.not.include($text.trim())
            }
          })
      })
      cy.getThreedotsIcon().click()
    })
  }

  #expectToSeeThreedotOption($wrapper, options) {
    cy.wrap($wrapper).within(() => {
      cy.getThreedotsIcon().click()
      cy.getDropdownList().each(($item) => {
        cy.wrap($item)
          .invoke('text')
          .then(($text) => {
            if (options.includes($text.trim())) {
              expect(options).to.include($text.trim())
            }
          })
      })
      cy.getThreedotsIcon().click()
    })
  }

  #expectToSeeNoteContent($element, fileVersion) {
    if (fileVersion.verifyNote) {
      cy.wrap($element).expectElementWithLabelVisible(fileVersion.note, '.col-11.pl-0 span')
    }
  }

  expectToSeeFilVersionThreedotOption(operation, name, fileVersion) {
    operation.getBaseFileVersionActionByVersionName(name, fileVersion.name, ($element) => {
      this.#expectToSeeThreedotOption($element, fileVersion.options)
    })
  }

  expectNotToSeeFilVersionThreedotOption(operation, name, fileVersion) {
    operation.getBaseFileVersionActionByVersionName(name, fileVersion.name, ($element) => {
      this.#expectNotToSeeThreedotOption($element, fileVersion.options)
    })
  }
  expectToSeeNoteThreedotOption(operation, name, fileVersion) {
    operation.getBaseFileVersionActionByVersionName(name, fileVersion.name, ($element) => {
      this.#expectToSeeThreedotOption($element, fileVersion.options)
    })
  }

  expectToSeeLatestFileVersionNote(operation, name, fileVersion) {
    operation.getBaseFileVersionActionByVersionName(name, fileVersion.name, ($element) => {
      this.#expectToSeeNoteContent($element, fileVersion)
      this.#expectToSeeThreedotOption($element, fileVersion.options)
    })
  }

  downloadThreedotIsDisabled(subject) {
    cy.wrap(subject).within(($file) => {
      cy.wrap($file).getDropdownItemByName(DropdownMenu.download).should('have.class', 'disabled')
    })
  }

  expectDownloadOptionInFolderDetailDisabled(file) {
    super._getFileOrFolderByName(file).each(($file) => {
      this.downloadThreedotIsDisabled($file)
    })
  }

  expectDownloadOptionInQuickAccessDisabled(file) {
    this.quickAccessAction._getFilesAndFoldersByName(file).each(($file) => {
      this.downloadThreedotIsDisabled($file)
    })
  }

  expectDownloadingToastDisappear() {
    cy.get('.toast-notification-full-width .show', { timeout: 300000 }).should('not.exist')
  }
  expectDownloadingToastDisplay() {
    cy.get('.toast-notification-full-width .show').within(($toast) => {
      cy.wrap($toast).should('be.visible')
      cy.expectElementWithLabelVisible('Downloading...', 'span')
    })
  }
  expectPreviewPopupNotExist() {
    cy.get('.preview-popup-wrapper').should('not.exist')
  }
  expectToDownloadVaultFileNotPreview() {
    this.expectPreviewPopupNotExist()
    this.expectDownloadingToastDisplay()
    this.expectDownloadingToastDisappear()
  }
  expectDownloadNotExistAfterSelectAllFiles(fileFolderOperation) {
    fileFolderOperation._selectAll()
    cy.get('button[name="btnDownload"]').should('not.exist')
  }
}

export default FileSharingAssertion
