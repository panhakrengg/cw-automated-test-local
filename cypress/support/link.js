Cypress.Commands.add('hasLink', (name, href = 'javascript:;') => {
  cy.get('a').contains(name).should('have.attr', 'href').should('include', href)
})

Cypress.Commands.add('hasLinkWithSpan', (name, href = 'javascript:;') => {
  cy.contains(name).parents('a').should('have.attr', 'href', href)
})
Cypress.Commands.add('clickBackLink', () => {
  cy.get('.cec-card__header > a').should('be.visible').click()
})
Cypress.Commands.add('hasLinkNoHref', { prevSubject: 'optional' }, (subject, name) => {
  const ele = subject ? cy.wrap(subject) : cy
  ele.get(`a:contains(${name})`).should('not.have.attr', 'href')
})
Cypress.Commands.add('clickLinkByName', { prevSubject: 'optional' }, (subject, name) => {
  const ele = subject ? cy.wrap(subject) : cy
  ele.get(`a:contains(${name})`).click()
})
Cypress.Commands.add('noLink', { prevSubject: 'optional' }, (subject, name) => {
  const ele = subject ? cy.wrap(subject) : cy
  ele.get(`a:contains(${name})`).should('not.exist')
})

Cypress.Commands.add('getLinksWithLabel', { prevSubject: 'optional' }, (subject, label) => {
  if (subject) {
    cy.wrap(subject).get(`a:contains("${label}")`)
  } else {
    cy.get(`a:contains("${label}")`)
  }
})
