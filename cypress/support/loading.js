const defaultTimeOut = 15000
Cypress.Commands.add('expectOverlayIsVisible', (wait = defaultTimeOut) => {
  cy.get('.cec-loading-overlay', { timeout: wait }).should('be.visible')
})

Cypress.Commands.add('waitLoadingOverlayNotExist', (wait = defaultTimeOut) => {
  cy.get('.cec-loading-overlay', { timeout: wait }).should('not.exist')
})

Cypress.Commands.add('loadingOverlayCompleted', (wait = defaultTimeOut) => {
  cy.expectOverlayIsVisible(wait)
  cy.waitLoadingOverlayNotExist(wait)
})

Cypress.Commands.add('waitIconLoadingVisible', (wait = defaultTimeOut) => {
  cy.get('.icon-loading', { timeout: wait }).should('be.visible')
})

Cypress.Commands.add('waitIconLoadingNotExist', (wait = defaultTimeOut) => {
  cy.get('.icon-loading', { timeout: wait }).should('not.exist')
})

Cypress.Commands.add('waitUntilIconLoadingLgIsVisible', (wait = defaultTimeOut) => {
  cy.get('.icon-loading-lg', { timeout: wait }).should('be.visible')
})

Cypress.Commands.add('waitUntilIconLoadingLgNotExist', (wait = defaultTimeOut) => {
  cy.get('.icon-loading-lg', { timeout: wait }).should('not.exist')
})
