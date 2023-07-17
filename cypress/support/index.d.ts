// load the global Cypress types
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Log message when run studio
     */
    logInTestCase(msg: string): void

    /**
     *
     */
    getElementWithLabel(label: string, element: string): Chainable<Element>
  }
}
