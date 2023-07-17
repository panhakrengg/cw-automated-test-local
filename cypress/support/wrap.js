Cypress.Commands.add('wrapOff', (subject) => {
  return cy.wrap(subject, { log: false })
})
