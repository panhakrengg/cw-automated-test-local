/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Select `.cec-card`
     * @alias cecCard
     */
    cecCard(alias: string): Chainable<Element>

    /**
     * Select `.cec-card__header`
     */
    cecCardHeader(): Chainable<Element>

    /**
     * Select `.cec-card__header_fix_height`
     */
    cecCardHeaderFixHeight(): Chainable<Element>

    /**
     * Select `.cec-card__title`
     */
    cecCardTitle(): Chainable<Element>

    /**
     * Select `.cec-card__body`
     */
    cecCardBody(): Chainable<Element>

    /**
     * Select `.cec-card__body`
     */
    cecCardBodyWithIndex(index: number): Chainable<Element>

    /**
     * Select `.card-body`
     */
    cardBody(): Chainable<Element>

    /**
     * Select `.card-title`
     */
    cardTitle(): Chainable<Element>

    /**
     * Select `.card-text`
     */
    cardContent(): Chainable<Element>

    /**
     * Select `.cec-card__right-content`
     * @alias cardRightContent
     */
    cardRightContent(): Chainable<Element>

    /**
     * Select `.cec-card__main-content`
     * @alias cardMainContent
     */
    cardMainContent(): Chainable<Element>

    /**
     * Select `.cec-detail-panel`
     */
    cecDetailPanel(): Chainable<Element>
  }
}
