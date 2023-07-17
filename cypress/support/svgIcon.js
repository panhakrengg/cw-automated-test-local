const svgElement = '.lexicon-icon > g'

Cypress.Commands.add('hasSvgIcon', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).get(svgElement).should('be.visible')
  } else {
    cy.get(svgElement).should('be.visible')
  }
})

Cypress.Commands.add('hidedSvgIcon', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).get(svgElement).should('not.be.visible')
  } else {
    cy.get(svgElement).should('not.be.visible')
  }
})

Cypress.Commands.add('noSvgIcon', { prevSubject: 'optional' }, (subject) => {
  subject
    ? cy.wrap(subject).within(() => cy.get(svgElement).should('not.exist'))
    : cy.get(svgElement).should('not.exist')
})
