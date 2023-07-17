Cypress.Commands.add(
  'getCheckboxList',
  { prevSubject: 'optional' },
  (subject) => {
    if (subject) {
      return cy.wrap(subject).find('.input-checkbox-wrapper')
    }
  }
)
Cypress.Commands.add(
  'isCheckedByName',
  { prevSubject: 'optional' },
  (subject, name) => {
    if (subject) {
      cy.wrap(subject)
        .getCheckboxList()
        .filter(`:contains(${name})`)
        .children()
        .within(($wrapper) => {
          cy.get($wrapper).find('input').should('be.checked')
        })
    }
  }
)
Cypress.Commands.add(
  'isNotChecked',
  { prevSubject: 'optional' },
  (subject, name) => {
    if (subject) {
      cy.wrap(subject)
        .getCheckboxList()
        .filter(`:contains(${ name })`)
        .first()
        .children()
        .within(($wrapper) => {
          cy.get($wrapper).find('input').should('not.be.checked')
        })
    }
  }
)
Cypress.Commands.add(
  'minusCheckBox',
  { prevSubject: 'optional' },
  (subject) => {
    if (subject) {
      return cy
        .wrap(subject)
        .find('span.checkbox-minus > input')
        .should('have.attr', 'type', 'checkbox')
    }
  }
)
Cypress.Commands.add(
  'checkboxByLabel',
  { prevSubject: 'optional' },
  (subject, label, element = 'span') => {
    if (subject) {
      return cy
        .wrap(subject)
        .find(element)
        .contains(label)
        .parents('label')
        .find('input')
        .should('have.attr', 'type', 'checkbox')
    } else {
      return cy
        .get('span')
        .contains(label)
        .parents('label')
        .find('input')
        .should('have.attr', 'type', 'checkbox')
    }
  }
)

Cypress.Commands.add('getCheckbox', { prevSubject: 'optional' }, (subject) => {
  return subject
    ? cy.wrap(subject).get('input[type="checkbox"]')
    : cy.get('input[type="checkbox"]')
})

Cypress.Commands.add('isCheckboxDisabled', { prevSubject: 'optional' }, () => {
  return cy.getCheckbox().should('have.attr', 'disabled')
})

Cypress.Commands.add('isUnchecked', { prevSubject: 'optional' }, () => {
  return cy.getCheckbox().should('not.be.checked')
})

Cypress.Commands.add('isChecked', { prevSubject: 'optional' }, () => {
  return cy.getCheckbox().should('be.checked')
})

Cypress.Commands.add('isCheckboxEnabled', () => {
  return cy.getCheckbox().should('not.have.attr', 'disabled')
})
