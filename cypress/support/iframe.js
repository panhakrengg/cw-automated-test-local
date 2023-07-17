Cypress.Commands.add('getIframeBody', { prevSubject: 'true' }, (subject) => {
  if (subject) {
    cy.get(subject).then(($iframe) => {
      const $document = cy.get($iframe).its('0.contentDocument').should('not.be.empty')
      return $document.its('body')
    })
  }
})
