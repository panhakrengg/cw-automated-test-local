Cypress.Commands.add('expectToastMessage', (message, forceToHide = false) => {
  cy.get('.toast-notification-full-width > .show')
    .within(($toast) => {
      cy.wrap($toast).should('contain.text', message)
      cy.wrap($toast).find('.lexicon-icon').first().should('exist')
      cy.wrap($toast).find('button.close').should('exist')
    })
    .as('showToast')
  if (forceToHide) cy.get('@showToast').invoke('removeClass', 'show')
})

Cypress.Commands.add(
  'toast',
  { prevSubject: 'optional' },
  (subject, cssClass = '.toast-notification-full-width') => {
    if (!subject) return
    return cy
      .wrap(subject)
      .portletBody()
      .find(cssClass + ' > .toast')
  }
)

//Example: cy.toast().closeToast()
Cypress.Commands.add('closeToast', { prevSubject: 'optional' }, (subject) => {
  if (!subject) return
  return cy.wrap(subject).find('> button.close').click({ force: true })
})

Cypress.Commands.add('waitUntilToastDisappear', () => {
  cy.get('.toast-notification-full-width > .alert').should('not.exist')
})

Cypress.Commands.add('waitToastAppearThenDisappear', (message) => {
  if (message) cy.expectToastMessage(message)
  else cy.get('.toast-notification-full-width > .alert').should('exist')

  cy.get('.toast-notification-full-width > .alert').should('not.exist')
})
