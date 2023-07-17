/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * @description cy.get('img').imageResponseSuccess()
     *
     * Assert `be.visible` img then get full src url getExtractUrlFromContent.
     *
     * Assert url status 200
     */
    imageResponseSuccess(): Chainable<Element>

    /**
     * @description cy.get('img').cwImageRestResponseSuccess()
     *
     * Assert `be.visible` img then get document library url getCwRestImageUrl.
     *
     * Assert url status 200
     */
    cwImageRestResponseSuccess(): Chainable<Element>
  }
}
