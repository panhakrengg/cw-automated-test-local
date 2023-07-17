Cypress.Commands.add('imageResponseSuccess', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .invoke('attr', 'src')
    .then(($src) => {
      cy.getExtractUrlFromContent($src).then(($url) => {
        cy.request($url.href).its('status').should('eq', 200)
      })
    })
})

Cypress.Commands.add('cwImageRestResponseSuccess', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject)
    .should('be.visible')
    .invoke('attr', 'src')
    .then(($src) => {
      cy.getCwRestImageUrl($src).then(($url) => {
        cy.request($url).its('status').should('eq', 200)
      })
    })
})

Cypress.Commands.add('imageSourceInclude', (src) => {
  cy.get('img').should('have.attr', 'src').should('include', src)
})
