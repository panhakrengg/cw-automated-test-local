Cypress.Commands.add(
  'getValidationError',
  { prevSubject: 'optional' },
  (subject, message) => {
    const element = subject
      ? cy.wrap(subject).get('.text-danger')
      : cy.get('.text-danger')
    element
      .should('have.css', 'color', 'rgb(208, 2, 27)')
      .and('contain.text', message)
    return element
  }
)
// Example: 1. cy.showErrorDuplicateName()
//  2. cy.swal2().showErrorDuplicateName() - if it's in popup
Cypress.Commands.add(
  'showErrorDuplicateName',
  { prevSubject: 'optional' },
  (subject) => {
    subject
      ? cy.wrap(subject).getValidationError('Duplicate name')
      : cy.getValidationError('Duplicate name')
  }
)
