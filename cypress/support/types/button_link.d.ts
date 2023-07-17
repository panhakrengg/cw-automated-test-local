/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Select `a[role="button"] span` that contain
     * @param btnName
     */
    buttonLink(btnName: string): Chainable<Element>
  }
}
