/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {

    /**
     * Select `<button disabled="disabled"/>`
     */
    buttonDisabled(): Chainable<Element>

    /**
     * Expect button not contain disable
     */
    buttonNotDisabled(): Chainable<Element>

    /**
     * Select `button.btn-primary` that contain
     * @param btnName
     */
    btnConfirm(btnName: string): Chainable<Element>

    /**
     * Select `button.btn-outline-primary` that contain
     * @param btnName
     */
    btnCancel(btnName: string): Chainable<Element>

    /**
     * Click `button.btn-primary`
     */
    clickPrimaryButton(): void

    /**
     * Select a file from fixture to `input[type="file"]`
     * @param path file name from fixture directory
     * @param classSelector
     */
    chooseFile(path: string, classSelector: string): void

    /**
     * Select `button` that contain
     * @param btnName
     * @param index
     */
    clickButtonByName(btnName: string, index: number): void

    /**
     * Select `button` that contain
     *
     * Assert `not.have.attr` disabled
     * @param btnName
     */
    expectButtonWithLabelAndEnabled(btnName: string): void

    /**
     * Select `button` that contain
     *
     * Assert `have.attr` disabled
     * @param btnName
     */
    expectButtonWithLabelAndDisabled(btnName: string): void

    /**
     * Select `button` that contain
     *
     * Assert `be.not.exist`
     * @param btnName
     */
    expectButtonWithLabelAndNotExist(btnName: string): void

    /**
     * Assert should `have.attr` disabled
     */
    isDisabled(): void

    /**
     * Assert should `not.have.attr` disabled
     */
    isEnabled(): void
  }
}
