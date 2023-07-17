/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Select `.cw-dropdown`
     * @alias cwDropdown
     */
    getCwDropdown(): Chainable<Element>

    /**
     * Select `.three-dots-icon`
     * @alias cwThreeDotsIcon
     */
    getThreedotsIcon(): Chainable<Element>

    /**
     * Select `.cw-split-dropdown`
     */
    getCwSplitDropdown(): Chainable<Element>

    /**
     * Select `.dropdown-three-dots`
     * @alias cwThreeDots
     */
    getThreeDots(): Chainable<Element>

    /**
     * Find `div[id^="${id}"]`
     * Select `div[data-toggle="tooltip"] span`
     * @param id
     */
    getDropdownSelected(id: string): Chainable<Element>

    /**
     * Assert `button.dropdown-button > span` to contain label then select parent
     * @param label
     */
    getDropdownButtonSelected(label: string): Chainable<Element>

    /**
     * Select `ul.dropdown-menu li`
     * @param alias default cwDropDownList
     * @alias cwDropDownList
     */
    getDropdownList(alias: string): Chainable<Element>

    /**
     * Select `ul.dropdown-menu > li`
     *
     * Then filter `li` contain menuName
     * @param menuName
     */
    getDropdownName(menuName: string): Chainable<Element>

    /**
     * Select `ul.dropdown-menu` then find `li` contain menuName then click
     * @param menuName
     */
    clickDropdownName(menuName: string): void

    /**
     * chain `getThreeDots` then scroll to view, then mouse over, then click
     * @param menuName
     */
    clickDropdownItem(menuName: string): void

    /**
     * Recommend to use `clickDropdownItem`
     * @deprecated
     * @param menuName
     */
    clickExact3DotsDropdownItem(menuName: string): void

    /**
     * Find element contain dropdownName, then find parents `.cw-dropdown`, then click
     * @param dropdownName
     */
    clickCwDropdown(dropdownName: string): void

    /**
     * Reuse `getCwDropdown` then mouse over and click, then reuse `clickDropdownName`
     * @param dropdownName
     */
    clickCwDropdownItem(dropdownName: string): void

    /**
     * Reuse `getCwSplitDropdown` then mouse over and click, then reuse `clickDropdownName`
     */
    clickCwSplitDropdownItem(menuName: string): void

    /**
     * Select `.dropdown-toggle`
     */
    getDropdownToggle(): void

    /**
     * Reuse `getDropdownToggle` then select by index and click, then reuse `clickDropdownName`
     * @param menuName
     * @param index
     */
    clickCwSplitDropdownToggle(menuName: string, index: number): void

    /**
     * Reuse `getDropdownToggle` then select a `li` that contain number
     * @param liNumber
     */
    clickDivDropdownToggle(liNumber: number): void

    /**
     * Select `.dropdown-menu`
     */
    getDropdownMenu(): Chainable<Element>

    /**
     * Recommend `getDropdownList`
     * @deprecated
     */
    cwDropdownMenuItems(): Chainable<Element>
  }
}
