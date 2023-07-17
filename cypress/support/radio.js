import Properties from '../classes/utilities/Properties'

Cypress.Commands.add('getRadioButton', { prevSubject: 'optional' }, (subject, name) => {
  if (subject) {
    return cy.wrap(subject).get(`.radio-container`).filter(`:contains(${name})`)
  } else {
    return cy.get(`.radio-container`).filter(`:contains(${name})`)
  }
})

//
// Chainable command after getRadioButton
// Example: getRadioButton().checkedRadioButton()
//

Cypress.Commands.add(
  'checkedRadioButton',
  { prevSubject: 'optional' },
  (subject, activeColor = Properties.toggleActiveColor) => {
    if (subject) {
      return cy
        .wrap(subject)
        .find('.radio-checkmark')
        .then(($el) => {
          const win = $el[0].ownerDocument.defaultView
          const before = win.getComputedStyle($el[0], '::after')
          const beforeContent = before.getPropertyValue('background')
          expect(beforeContent).to.have.contain(activeColor)
        })
    }
  }
)

Cypress.Commands.add('clickRadioButton', { prevSubject: 'optional' }, (subject, name) => {
  if (subject) {
    return cy.wrap(subject).getRadioButton(name).click()
  } else {
    return cy.getRadioButton(name).click()
  }
})


Cypress.Commands.add('isRadioChecked', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .find('input')
      .invoke('prop', 'checked')
      .then(($state) => {
        cy.wrap($state).as('isRadioChecked')
      })
    return cy.get('@isRadioChecked')
  }
})