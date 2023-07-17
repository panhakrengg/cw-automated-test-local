// load the global Cypress types
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {

    /**
     * Select `.cw-navigation__search input[placeholder="Search"]`
     */
    getSearchGlobal(): Chainable<Element>

    /**
     * Reuse `getSearchGlobal` then type keyword and hit enter
     * @param keywords
     */
    searchGlobal(keywords: string): void

    /**
     * Reuse `getSearchGlobal` then clear
     */
    clearSearchGlobal(): void

    /**
     * Show empty search result in global search
     * @param keywords
     */
    showEmptySearchResult(keywords: string): void
  }
}
