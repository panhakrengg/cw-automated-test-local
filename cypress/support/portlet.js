Cypress.Commands.add('portletBody', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).parents('.portlet-body')
  } else {
    cy.get('.portlet-body')
  }
})
Cypress.Commands.add('waitPortletReady', { prevSubject: 'optional' }, () => {
  cy.waitUntil(() =>
    cy.window().then((win) => {
      if (win.AUI) win.AUI.Env.DOMReady = true
    })
  )
})
