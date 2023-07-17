/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {

    /**
     * Assert `not.be.empty` iframe content document 
     * 
     * Find body and return
     */
    getIframeBody(): Chainable<Element>
  }
}
