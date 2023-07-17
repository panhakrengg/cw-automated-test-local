Cypress.Commands.add('denialPage', (title, content) => {
  cy.get('#_accessDenialPortlet_accessDenial')
    .should('be.visible')
    .find('.cec-card__body > h1')
    .should('contain.text', title)
    .next()
    .should('contain.text', content)
    .next()
    .should('contain.text', 'Back to Home')
})

Cypress.Commands.add('pageNotFound', () => {
  Cypress.on('uncaught:exception', () => false)
  cy.get('.portlet-content')
    .find('.cec-card > .cec-card__body')
    .should('contain.text', 'Oops! Page not found.')
})

Cypress.Commands.add('thisLinkIsNotAvailable', () => {
  cy.url().should('contain', '/access-denied')
  cy.denialPage(
    'This link is not available.',
    'This link may only be visible to a community you’re not a part of.'
  )
})
