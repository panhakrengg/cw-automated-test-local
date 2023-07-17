/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Select `.has-error`
     */
    getHasError(): Chainable<Element>

    /**
     * Reuse `getHasError` then find `input[type="text"]`
     *
     * Assert `have.css` border-color should red
     */
    hasErrorInputText(): void
  }
}
