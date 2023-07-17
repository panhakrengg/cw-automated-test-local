Cypress.Commands.add('clickNavigation', (label) => {
  cy.get('nav.nav').within(($nav) => {
    cy.wrap($nav).find('a').filter(`a:contains(${label})`).click({force: true})
  })
})
