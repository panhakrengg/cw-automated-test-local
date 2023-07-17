Cypress.Commands.add('labelText', { prevSubject: 'optional' }, (subject, labelFor, text) => {
  let labelElement = `label[for^="${labelFor}"]`
  if (subject) {
    cy.wrap(subject).find(labelElement).should('have.text', text)
  } else {
    cy.get(labelElement).should('have.text', text)
  }
})
Cypress.Commands.add(
  'getElementWithLabel',
  { prevSubject: 'optional' },
  (subject, label, element = '') => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get(`${element}:contains("${label}")`)
  }
)

Cypress.Commands.add(
  'expectElementWithLabelVisible',
  { prevSubject: 'optional' },
  (subject, label, element = '') => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.getElementWithLabel(label, element).should('be.visible')
  }
)
Cypress.Commands.add(
  'expectElementWithLabelNotExist',
  { prevSubject: 'optional' },
  (subject, label, element, waitTime = 10000) => {
    const wrapper = subject ? cy.wrap(subject) : cy
    wrapper.getElementWithLabel(label, element).should('not.exist', { timeout: waitTime })
  }
)
