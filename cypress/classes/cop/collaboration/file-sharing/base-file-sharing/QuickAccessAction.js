import BaseFileSharing from './BaseFileSharing'

class QuickAccessAction extends BaseFileSharing {
  constructor() {
    super()
  }

  _getMostRecentByName(name) {
    return this._getMostRecent().filter(`div:contains(${name}):first`)
  }

  _previewMostDownloadedByName(name) {
    this._getMostDownloaded().then(($fileList) => {
      cy.wrap($fileList).find(`a:contains(${name})`).click()
    })
  }

  _previewQuickAccessByName(name) {
    this._getQuickAccess().then(($fileList) => {
      cy.wrap($fileList).find(`a:contains(${name})`).first().click()
    })
  }

  _getMostDownloadedByName(name) {
    return this._getMostDownloaded().filter(`div:contains(${name}):first`)
  }

  _getMostRecent() {
    return this._getQuickAccess().eq(0).find('div.d-flex.cec-mb-4')
  }

  _getMostDownloaded() {
    return this._getQuickAccess().eq(1).find('div.d-flex.cec-mb-4')
  }

  _getQuickAccess() {
    return cy.get('div.quick-access-wrapper > .row > .col-sm-6')
  }

  _getFilesAndFoldersByName(name) {
    return cy.get('.d-flex.cec-mb-4').filter(`:contains(${name})`)
  }
}

export default QuickAccessAction
