Cypress.Commands.add('getExtractUrlFromContent', (content) => {
  const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
  const urlString = content.match(urlPattern)
  return new URL(urlString)
})

Cypress.Commands.add('getCwRestImageUrl', (content) => {
  cy.location().then((loc) => {
    return loc.origin + content
  })
})

Cypress.Commands.add('expectUrlInclude', (text) => {
  cy.url().should('include', text)
})

Cypress.Commands.add('visitUrlNotFound', (url) => {
  Cypress.on('uncaught:exception', () => false)
  cy.visit(url, { failOnStatusCode: false })
})
Cypress.Commands.add('visitCwDashboard', () => {
  cy.visit('/u/home/dashboard')
})
