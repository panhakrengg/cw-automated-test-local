/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Find `.input-checkbox-wrapper`
     */
    getCheckboxList(): Chainable<Element>

    /**
     * Find `.input-checkbox-wrapper` that contain text
     *
     * Assert `be.checked`
     * @param name
     */
    isCheckedByName(name: string): void

    /**
     * Find `.input-checkbox-wrapper` that contain text
     *
     * Assert `not.be.checked`
     * @param name
     */
    isNotChecked(name: string): void

    /**
     * Find `span.checkbox-minus > input` by subject
     *
     * Assert `have.attr` type `checkbox`
     */
    minusCheckBox(): Chainable<Element>

    /**
     * Find `span` contain text the select `input`
     *
     * Assert `have.attr` type `checkbox`
     * @param label
     */
    checkboxByLabel(label: string): Chainable<Element>

    /**
     * Select `input[type="checkbox"]`
     *
     */
    getCheckbox(): Chainable<Element>

    /**
     * Select `input[type="checkbox"]`
     *
     * Assert `have.attr` type `disabled`
     */
    isCheckboxDisabled(): void

    /**
     * Select `input[type="checkbox"]`
     *
     * Assert `not.be.checked`
     */
    isUnchecked(): void

    /**
     * Select `input[type="checkbox"]`
     *
     * Assert `be.checked`
     */
    isChecked(): void

    /**
     * Select `input[type="checkbox"]`
     *
     * Assert `not.have.attr` disabled
     */
    isChecked(): void
  }
}
