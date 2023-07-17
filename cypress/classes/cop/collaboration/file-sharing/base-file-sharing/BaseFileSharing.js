import Environment from '../../../../base/Environment'
import { DropdownMenu, MenuNavigation, RootFolderType } from './FileSharingConstant'
import InterceptRequestAction from './operation/InterceptRequestAction'

class BaseFileSharing {
  prefix
  envPrefixCombination
  env
  constructor(copUrl) {
    this.copUrl = copUrl
    this.env = new Environment()
    this.envPrefixCombination = this.env.getEnvPrefixCombination()
    this.prefix = this.env.getEnvYaml()
  }

  _setCopUrl(url) {
    this.copUrl = url
  }

  #buttonModeSel = {
    $el: `.action-button-section .d-md-flex .d-flex.justify-content-end .d-flex`,
  }

  _getUrlCoPFileSharing() {
    return this.copUrl + '/collaboration/file-sharing'
  }

  getUrlFolderDetail(copLink, folderId) {
    return (
      this._getUrlCoPFileSharing() +
      `?p_p_id=copFileSharingPortlet&p_p_lifecycle=0&_copFileSharingPortlet_folderId=${folderId}&_copFileSharingPortlet_redirect=https%3A%2F%2F${this.envPrefixCombination}connect.crosswired.com%2Fsearch%3Fp_p_id%3DdirectoryServicePortlet%26p_p_lifecycle%3D2%26p_p_cacheability%3DcacheLevelPage%26_directoryServicePortlet_mvcRenderCommandName%3D%252Fview%26_directoryServicePortlet_folderId%3D120756282%26_directoryServicePortlet_friendlyUrl%3D%252F${copLink}%26_directoryServicePortlet_webPresenceSite%3Dtrue%26p_p_resource_id%3D%252FdirectoryServicePortlet%252Fview_folder&_copFileSharingPortlet_mvcRenderCommandName=%2Ffile_sharing%2Ffetch_folder_details`
    )
  }

  _clickListViewMode() {
    InterceptRequestAction._itcViewModeUpdate.set()
    cy.get(this.#buttonModeSel.$el).first().click()
    InterceptRequestAction._itcViewModeUpdate.wait()
  }

  _clickGridViewMode() {
    InterceptRequestAction._itcViewModeUpdate.set()
    cy.get(this.#buttonModeSel.$el).last().click()
    InterceptRequestAction._itcViewModeUpdate.wait()
  }

  _visitFileSharingPage(shouldWait = false) {
    InterceptRequestAction._itcFetchQuickAccess.set()
    InterceptRequestAction._itcFetchFolderTree.set()
    InterceptRequestAction._itcFetchRepositorySize.set()
    cy.visit(this._getUrlCoPFileSharing(), { failOnStatusCode: false })
    InterceptRequestAction._itcFetchQuickAccess.wait()
    InterceptRequestAction._itcFetchFolderTree.wait()
    InterceptRequestAction._itcFetchRepositorySize.wait()
    if (shouldWait) {
      cy.wait(1000)
    }
    Cypress.on('uncaught:exception', () => false)
  }

  _accessToFavoriteFolderDetails() {
    InterceptRequestAction._itcFetchFolderDetails.set()
    this.#getMenuNavigationByName(MenuNavigation.favorite).click()
    InterceptRequestAction._itcFetchFolderDetails.wait()
  }

  _accessToQuickAccessFolderDetails() {
    InterceptRequestAction._itcFetchQuickAccess.set()
    this.#getMenuNavigationByName(MenuNavigation.quickAccess).click()
    InterceptRequestAction._itcFetchQuickAccess.wait()
  }

  _accessToCommunityFilesFolderDetails() {
    InterceptRequestAction._itcFetchFolderDetails.set()
    this._accessToFolderDetailsViaSidebar(RootFolderType.community)
    InterceptRequestAction._itcFetchFolderDetails.wait()
    cy.wait(1000)
  }

  _accessToVaultFolderDetailsViaSidebar() {
    InterceptRequestAction._itcFetchFolderDetails.set()
    this._accessToFolderDetailsViaSidebar(RootFolderType.vault)
    InterceptRequestAction._itcFetchFolderDetails.wait()
  }

  _accessToVaultFolderDetails() {
    this._accessToFolderDetailsViaFolderName(RootFolderType.vault)
    cy.wait(1000)
  }

  _accessToPlatformFolderDetails() {
    this._accessToFolderDetailsViaSidebar(RootFolderType.platform)
  }

  _accessToOrganizationFolderDetails() {
    this._accessToFolderDetailsViaSidebar(RootFolderType.organization)
  }

  _accessToRecycleBin() {
    InterceptRequestAction._itcFetchTrash.set()
    this.#getMenuNavigationByName(MenuNavigation.recycleBin).click()
    InterceptRequestAction._itcFetchTrash.wait()
  }

  _getBaseFileSharingSidebar() {
    return cy.get('div.file-sharing__sidebar').eq(0)
  }

  _getFileSharingSidebar(callback = () => {}) {
    this._getBaseFileSharingSidebar().within(() => {
      this.#executeResult(callback)
    })
  }

  _getBaseSwal2Content(callback = () => {}) {
    cy.swal2()
      .getSwal2Content()
      .within(($content) => {
        cy.wrap($content).as('moveFolderTree')
        callback()
      })
  }

  _expandCommunityFilesFolderInMovePopup() {
    this._getBaseSwal2Content(() => {
      this._expandCommunityFilesFolder()
    })
  }

  _expandPlatformFolderInMovePopup() {
    this._getBaseSwal2Content(() => {
      this._expandPlatformFilesFolder()
    })
  }

  _expandPlatformFilesFolder() {
    this._expandFolderTree(RootFolderType.platform, () => {
      cy.get('@expand').click()
    })
  }

  _expandCommunityFilesFolder() {
    this._expandFolderTree(RootFolderType.communityFile, () => {
      cy.get('@expand').click()
    })
  }

  _getFolderTree(folderName) {
    return cy.get(`ul > li > div.tree-item:contains("${folderName}")`)
  }

  _expandFolderTree(folderName, callback = () => {}) {
    this._getFolderTree(folderName).then(($folderTree) => {
      if ($folderTree) {
        cy.wrap($folderTree)
          .find('span.glyphicon')
          .eq(0)
          .as('expand')
          .invoke('attr', 'class')
          .then(($clazz) => {
            if (!$clazz.includes('glyphicon-triangle-bottom')) {
              this.#executeResult(callback)
            }
          })
      }
    })
  }

  _accessToFolderDetailsViaSidebar(folderName) {
    this._getFileSharingSidebar(() => {
      cy.get(`ul > li:contains("${folderName}")`).eq(0).click()
    })
  }

  #accessToFolderDetailsViaFolderName(folderName, callback = () => {}) {
    cy.get('div.file-sharing-details', { timeout: 1000 }).within(() => {
      this.#executeResult(callback)
    })
  }

  _clickFile(name) {
    cy.get('table.cw-table > tbody > tr').find(`a:contains("${name}")`).first().click()
  }

  _clickVaultFile(name) {
    cy.get('table.cw-table > tbody > tr')
      .find(`a:contains("${name}")`)
      .prev()
      .should('have.class', 'lexicon-icon')
      .then(($lockIcon) => {
        cy.wrap($lockIcon).next().click()
      })
  }

  _accessToFolderDetailsViaFolderName(folderName) {
    this.#accessToFolderDetailsViaFolderName(folderName, () => {
      cy.get('table.cw-table > tbody > tr', {timeout: 15000})
        .find(`a:contains("${folderName}")`).click()
    })
  }

  _ifTableListExist() {
    cy.wrap(false).as('ifTableListExist')
    cy.get('div.file-sharing-details').then(($fileSharingDetails) => {
      if ($fileSharingDetails.find('table.cw-table').length) {
        cy.wrap(true).as('ifTableListExist')
      }
    })
    return cy.get('@ifTableListExist')
  }

  _ifGridListExist() {
    cy.wrap(false).as('ifGridListExist')
    cy.get('div.file-sharing-details').then(($fileSharingDetails) => {
      if ($fileSharingDetails.find('div.row .col-6').length) {
        cy.wrap(true).as('ifGridListExist')
      }
    })
    return cy.get('@ifGridListExist')
  }

  _checkIfFileOrFolderEmpty() {
    cy.wrap(false).as('isFileOrFolderEmpty')
    cy.waitLoadingOverlayNotExist()
    cy.get('div.file-sharing-details').then(($fileSharingDetails) => {
      if (!$fileSharingDetails.find('table.cw-table').length) {
        cy.wrap(true).as('isFileOrFolderEmpty')
      }
    })
    return cy.get('@isFileOrFolderEmpty')
  }

  _getFileOrFolderByNameInQuickAccess(name) {
    cy.get(`a.text-black:contains("${name}")`).parents('.d-flex.cec-mb-4').as('fileOrFolder')
    return cy.get('@fileOrFolder')
  }

  _getFileOrFolderByName(name, callback = () => {}) {
    cy.wrap(null).as('currentRow')
    cy.waitLoadingOverlayNotExist()
    cy.get('div.file-sharing-details').then(($fileSharingDetails) => {
      if ($fileSharingDetails.find('table.cw-table').length) {
        cy.cwTable().then(($cwTable) => {
          if ($cwTable.find(`tr:contains("${name}")`).length) {
            cy.wrap($cwTable).find(`tr:contains("${name}")`).as('currentRow')
          }
          callback($cwTable)
        })
      }
    })
    return cy.get('@currentRow')
  }

  _invokeDeleteActionOnDropZone($content) {
    cy.wrap($content)
      .getElementWithLabel('Invalid file type', 'span.text-danger')
      .each(() => {
        cy.get('span.text-danger')
          .parents('.align-items-center.file-item')
          .last()
          .within(() => {
            cy.get('a.text-black .cw-icon-trash').click()
          })
      })
  }

  _executeClearButtonAction() {
    cy.get('@searchInputWrapper').then(($content) => {
      cy.wrap($content).get('.clear-button').click()
    })
  }

  _getSearchFileOrFolderByName(name, intercept = InterceptRequestAction._itcSearchFileAndFolder) {
    cy.wrap(false).as('search')
    cy.get('.search-wrapper .search-input')
      .eq(0)
      .as('searchInputWrapper')
      .within(($search) => {
        intercept.set()
        cy.wrap($search).get('input[type="text"]').clear().type(`${name} {enter}`).as('search')
        intercept.wait()
      })
    return cy.get('@search')
  }

  _clickOnColumnHeaderByName(name) {
    cy.cwTable().getTableHeader(name).find('a').first().click()
  }

  #getMenuNavigationByName(name) {
    return cy.get(`div.file-sharing__sidebar > .menu-navigation > div:contains("${name}")`)
  }

  #executeResult(callback = () => {}) {
    InterceptRequestAction._itcFetchFolderDetails.set()
    callback()
    InterceptRequestAction._itcFetchFolderDetails.wait()
  }

  findFileOrFolderOpenEntryUrl(fileOrFolderName, isFolder) {
    cy.wait(1000)
    this._getFileOrFolderByName(fileOrFolderName)
    cy.wait(1000)
    cy.get('@currentRow').within(($currentRow) => {
      cy.wrap($currentRow).clickDropdownItem(DropdownMenu.copyLink)
      cy.get('@itcFetchFolderDetails')
        .its('response.body.result')
        .then(($response) => {
          let result = JSON.parse($response)
          this.setOpenEntryUrlByName(isFolder, result, fileOrFolderName)
        })
    })
  }

  setOpenEntryUrlByName(isFolder, result, fileOrFolderName) {
    let query = ''
    query = isFolder ? 'folders' : 'files'
    let folder = Cypress._.find(result[query], {
      name: fileOrFolderName,
    })
    cy.wrap(folder.openEntryUrl).as('openEntryUrl')
  }

  clickCopyLinkFolder(folderName) {
    this.findFileOrFolderOpenEntryUrl(folderName, true)
  }

  clickCopyLinkFile(folderName) {
    this.findFileOrFolderOpenEntryUrl(folderName, false)
  }

  pasteLink() {
    cy.get('@openEntryUrl').then((url) => {
      cy.visit(url, { timeout: 15000 })
    })
  }
}
export default BaseFileSharing
