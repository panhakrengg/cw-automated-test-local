Cypress.Commands.add('getHasError', { prevSubject: 'optional' }, (subject) => {
  return subject ? cy.wrap(subject).get('.has-error') : cy.get('.has-error')
})
// Example: 1. cy.hasErrorInputText()
//  2. cy.swal2().hasErrorInputText() - if it's in popup
Cypress.Commands.add(
  'hasErrorInputText',
  { prevSubject: 'optional' },
  (subject) => {
    const element = subject ? cy.wrap(subject).getHasError() : cy.getHasError()
    element
      .find('input[type="text"]')
      .should('have.css', 'border-color', 'rgb(208, 2, 27)')
  }
)
