const aliasSplitDropdown = 'cwSplitDropdown'
const dropdown = {
  wrapper: `.cw-split-dropdown`,
  default: `.btn-action-default`,
  toggle: `.dropdown-toggle-split`,
}

Cypress.Commands.add(
  'getCwSplitDropdown',
  { prevSubject: 'optional' },
  (subject, alias = aliasSplitDropdown) => {
    return subject
      ? cy.wrap(subject).get(dropdown.wrapper).as(alias)
      : cy.get(dropdown.wrapper).as(alias)
  }
)

Cypress.Commands.add(
  'clickCwSplitDropdownItem',
  { prevSubject: 'optional' },
  (subject, menuName, alias = aliasSplitDropdown) => {
    const aliasDropdown = `@${alias}`
    if (subject) {
      cy.wrap(subject).getCwSplitDropdown()
    } else {
      cy.getCwSplitDropdown()
    }
    clickDropdown(aliasDropdown, menuName)
  }
)

Cypress.Commands.add(
  'expectDefaultCwSplitDropdown',
  (defaultMenuName, alias = aliasSplitDropdown) => {
    cy.getCwSplitDropdown(alias).get(dropdown.default).should('contain', defaultMenuName)
  }
)

Cypress.Commands.add(
  'getCwSplitDropdownMenuItems',
  (defaultMenuName, alias = aliasSplitDropdown) => {
    cy.getCwSplitDropdown(alias)
      .get(dropdown.toggle)
      .trigger('mouseover')
      .click()
      .then(($dropdownToggle) => {
        return cy.wrap($dropdownToggle).next()
      })
  }
)

function clickDropdown(aliasDropdown, menuName) {
  cy.get(aliasDropdown).get(dropdown.toggle).trigger('mouseover').click()
  cy.get(aliasDropdown).clickDropdownName(menuName)
}
