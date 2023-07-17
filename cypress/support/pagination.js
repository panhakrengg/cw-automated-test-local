Cypress.Commands.add(
  'selectItemPerPage',
  { prevSubject: 'optional' },
  (subject, number = 20) => {
    if (subject) {
      cy.wrap(subject).should('be.visible')
      cy.wrap(subject)
        .get('div.cw-pagination')
        .within(() => {
          cy.get('div.entry-dropdown').as('dropdownWrapper')
        })
      cy.get('@dropdownWrapper').clickDivDropdownToggle(number)
    } else {
      cy.get('div.cw-pagination').within(() => {
        cy.get('div.entry-dropdown').clickDivDropdownToggle(number)
      })
    }
  }
)
