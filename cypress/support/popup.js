import Field from '../classes/constants/Field'

Cypress.Commands.add('checkAccessExternalLinkPopup', (url) => {
  cy.swal2().within(($swal2) => {
    cy.getSwal2Header().should('have.text', 'External Link Notice')
    cy.contains('.swal2-confirm', Field.CONTINUE).should('exist')
    cy.contains('.swal2-cancel', 'Go back').should('exist')
    cy.wrap($swal2)
      .getSwal2Content()
      .within(() => {
        cy.get('#swal2-content .swal2-icon > svg').should('be.visible')
        cy.contains(
          'p',
          'You are continuing to another website. For your safety, do not share your account credentials or any sensitive information.'
        ).should('be.visible')
        cy.contains('b', 'External Link:')
        cy.contains(url)
        cy.wrap($swal2).closeSwal2()
      })
  })
})
