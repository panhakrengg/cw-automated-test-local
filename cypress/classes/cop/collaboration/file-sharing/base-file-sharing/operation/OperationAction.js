class OperationAction {

  static #clickOnEntryButton(buttonName) {
    cy.get(`button[name="${buttonName}"]`).click()
  }

  static _clickOnNewUploadButton() {
    this.#clickOnEntryButton("btnUpload")
  }

  static _clickOnNewDocumentButton() {
    this.#clickOnEntryButton("btnNewDocument")
  }

  static _clickOnNewFolderButton() {
    this.#clickOnEntryButton("btnNewFolder")
  }

  static _clickOnMoveButton() {
    this.#clickOnEntryButton("btnMove")
  }

  static _clickOnDownloadButton() {
    this.#clickOnEntryButton("btnDownload")
  }

  static _clickOnDeleteButton() {
    this.#clickOnEntryButton("btnDelete")
  }

  static _clickOnThreeDot(item) {
    cy.wrap(item).within(() => {
      cy.getThreedotsIcon().click()
    })
  }

  static _clickDropdownName(item, action) {
    cy.wrap(item).within(() => {
      cy.getThreedotsIcon().click()
      cy.wrap(item).clickDropdownName(action)
    })
  }

  static _isActionExist(item, action) {
    cy.wrap(false).as('actionExist')
    cy.wrap(item).within(() => {
      cy.wrap(item).get('ul.dropdown-menu > li')
        .invoke('text')
        .then(($text) => {
          if ($text.includes(action)) {
            cy.wrap(true).as('actionExist')
          }
        })
    })
    return cy.get('@actionExist')
  }
}

export default OperationAction
