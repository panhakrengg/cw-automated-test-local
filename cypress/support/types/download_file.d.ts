/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     *
     * @description Click on a link will open a new tab then download a file
     * @param attachmentName
     */
    verifyDownloadAttachmentViaLink(attachmentName: string): void
  }
}
