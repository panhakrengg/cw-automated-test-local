import BaseFileSharing from '../cop/collaboration/file-sharing/base-file-sharing/BaseFileSharing'
import InterceptRequestAction from '../cop/collaboration/file-sharing/base-file-sharing/operation/InterceptRequestAction'

class FilesTab {
  #copUrl

  constructor(copUrl) {
    this.#copUrl = copUrl
  }

  getFileFolderCard(name) {
    cy.getElementWithLabel(name, 'strong').parents('.cec-card__body').as('fileFolderCard')
  }

  getLocation(baseLocation) {
    let actualLocation = ''
    if (baseLocation.length > 0)
      baseLocation.forEach((folderName) => {
        actualLocation += folderName.concat(' / ')
      })
    return actualLocation.substring(0, actualLocation.length - 3)
  }

  clickViewFile(fileName) {
    this.getFileFolderCard(fileName)
    cy.get('@fileFolderCard').within(() => {
      cy.clickLinkByName('View File')
    })
  }

  clickViewFolder(folderId) {
    InterceptRequestAction._itcFetchFolderDetails.set()
    cy.visit(
      new BaseFileSharing(this.#copUrl).getUrlFolderDetail(this.#copUrl.split('/')[2], folderId)
    )
    InterceptRequestAction._itcFetchFolderDetails.wait()
    Cypress.on('uncaught:exception', () => false)
  }

  expectFileFolderCard(name, location, buttonName, index = 0) {
    this.getFileFolderCard(name)
    cy.get('@fileFolderCard')
      .eq(index)
      .within(() => {
        cy.get('.text-primary').hasSvgIcon().expectElementWithLabelVisible(name, 'strong')
        cy.get('.location')
          .invoke('text')
          .then((text) => {
            expect(text.trim()).to.contain(`Location: ${this.getLocation(location)}`)
          })
        cy.hasLinkNoHref(buttonName)
      })
  }
  expectFileFolderCardByLocation(location, name, buttonName, index = 0) {
    this.getFileFolderCard(this.getLocation(location))
    cy.get('@fileFolderCard')
      .eq(index)
      .within(() => {
        cy.get('.text-primary').hasSvgIcon().expectElementWithLabelVisible(name, 'strong')
        cy.get('.location')
          .invoke('text')
          .then((text) => {
            expect(text.trim()).to.contain(`Location: ${this.getLocation(location)}`)
          })
        cy.hasLinkNoHref(buttonName)
      })
  }
}

export default FilesTab
