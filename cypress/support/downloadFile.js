import SpyOpenWindowEvent from '../classes/base/SpyOpenWindowEvent'

require('cypress-downloadfile/lib/downloadFileCommand')

Cypress.Commands.add('verifyDownloadAttachmentViaLink', (attachmentName) => {
  const spyOpenWindowEvent = new SpyOpenWindowEvent()
  spyOpenWindowEvent.setSpy()
  cy.getElementWithLabel(attachmentName, 'a').click()
  spyOpenWindowEvent.getUrl().then(($url) => {
    cy.downloadFile($url, 'cypress/downloads', attachmentName)
    cy.verifyDownload(attachmentName)
  })
})

Cypress.Commands.add('verifyDownloadFileSize', (attachmentName, size = '1000') => {
  cy.verifyDownload(attachmentName)
  cy.readFile(`cypress/downloads/${attachmentName}`, 'binary').should((buffer) => {
    expect(buffer.length).to.be.gt(size)
  })
})
