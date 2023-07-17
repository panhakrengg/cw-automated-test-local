Cypress.Commands.add('expectTotalCount', (text) => {
  cy.contains(new RegExp(`${text} .*\(\\d+\)`)).should('have.length.gt', 0)
})
