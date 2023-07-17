/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Find `.cec-popup`
     */
    getPopup(): Chainable<Element>

    /**
     * Find `.cec-popup__header`
     */
    getPopupHeader(): Chainable<Element>

    /**
     * Assert `.cec-popup__header span` to contain
     * @param title
     */
    checkPopupHeader(title: string): Chainable<Element>

    /**
     * Find `.cec-popup__body`
     */
    getPopupBody(): Chainable<Element>

    /**
     * Find `.cec-popup__footer`
     */
    getPopupFooter(): Chainable<Element>

    /**
     * Find `.link-icon` inside `.cec-popup__header` then close
     */
    closePopup(): void
  }
}
