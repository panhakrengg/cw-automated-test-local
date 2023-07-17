Cypress.Commands.add('clickDropdownSelect', { prevSubject: 'optional' }, (subject, label) => {
  if (subject) {
    cy.wrap(subject)
      .get('select')
      .first()
      .within(($select) => {
        cy.wrap($select).select(label)
      })
  } else {
    cy.get('select')
      .first()
      .within(($select) => {
        cy.wrap($select).select(label)
      })
  }
})

Cypress.Commands.add('getSelectOptionWith', { prevSubject: 'optional' }, (subject, option = '') => {
  if (subject) {
    cy.wrap(subject)
      .get('select')
      .first()
      .within(($select) => {
        return cy.wrap($select).get('option').filter(`:contains("${option}")`)
      })
  } else {
    cy.get('select')
      .first()
      .within(($select) => {
        return cy.wrap($select).get('option').filter(`:contains("${option}")`)
      })
  }
})

Cypress.Commands.add('getVueTreeSelect', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.vue-treeselect')
  }
})

Cypress.Commands.add('getVueTreeSelectListItems', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.vue-treeselect__list-item')
  }
})

Cypress.Commands.add('getVueTreeSelectOptions', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.vue-treeselect__option')
  }
})

Cypress.Commands.add('clickVueTreeSelect', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).getVueTreeSelect().click()
  }
})

Cypress.Commands.add('clickVueTreeSelectOption', { prevSubject: 'optional' }, (subject, label) => {
  if (subject) {
    cy.wrap(subject).getVueTreeSelectOptions().filter(`:contains("${label}")`).click()
  }
})

Cypress.Commands.add('expectSelectHaveText', { prevSubject: 'optional' }, (subject, value) => {
  const ele = subject ? cy.wrap(subject) : cy
  ele.get('select').should('contains.text', value)
})
