Cypress.Commands.add(
  'navBarCollapse',
  { prevSubject: 'optional' },
  (subject, label) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get('.navbar-collapse').find('a').filter(`a:contains(${label})`)
  }
)
Cypress.Commands.add(
  'clickCollapseIcon',
  { prevSubject: 'optional' },
  (subject) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get('.collapse-icon').click()
  }
)
