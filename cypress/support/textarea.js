Cypress.Commands.add(
  'typeInTextareaByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder, text) => {
    if (subject) {
      return cy.wrap(subject).get(`placeholder="${placeholder}"`).type(text).blur()
    }
    return cy.get(`textarea[placeholder="${placeholder}"]`).type(text).blur()
  }
)

Cypress.Commands.add(
  'clearTextareaByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder) => {
    if (subject) {
      return cy.wrap(subject).get(`placeholder="${placeholder}"`).type(text).blur()
    }
    return cy.get(`textarea[placeholder="${placeholder}"]`).clear()
  }
)

Cypress.Commands.add(
  'getTextareaByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder) => {
    if (subject) {
      return cy.wrap(subject).get(`placeholder="${placeholder}"`)
    }
    return cy.get(`textarea[placeholder="${placeholder}"]`)
  }
)

Cypress.Commands.add('typeInTextarea', { prevSubject: 'optional' }, (subject, text, index = 0) => {
  cy.wrap(subject).get(`textarea`).eq(index).type(text)
})

Cypress.Commands.add('getTextareaByLabel', { prevSubject: 'optional' }, (subject, label) => {
  const ele = subject ? cy.wrap(subject) : cy
  return ele.contains(label).parent().find('textarea')
})

Cypress.Commands.add(
  'typeTextareaByLabel',
  { prevSubject: 'optional' },
  (subject, label, value) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.getTextareaByLabel(label).clear().type(value)
  }
)

Cypress.Commands.add(
  'expectTextareaValue',
  { prevSubject: 'optional' },
  (subject, label, value) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.getTextareaByLabel(label).should('have.value', value)
  }
)

Cypress.Commands.add(
  'expectTextareaNotContainValue',
  { prevSubject: 'optional' },
  (subject, label, value) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.getTextareaByLabel(label).should('not.have.value', value)
  }
)
