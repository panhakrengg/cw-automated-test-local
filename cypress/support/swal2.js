import Field from '../classes/constants/Field'

Cypress.Commands.add('swal2', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrapOff(subject)
      .parents('body')
      .find('.swal2-container > .swal2-popup')
      .within(($popup) => {
        return $popup
      })
  } else {
    return cy.get('.swal2-container > .swal2-popup')
  }
})

Cypress.Commands.add('getSwal2Header', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrapOff(subject)
      .find('.swal2-header > .swal2-title')
      .within(($header) => {
        return $header
      })
  } else {
    return cy.get('.swal2-header > .swal2-title')
  }
})

Cypress.Commands.add('getSwal2Content', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrapOff(subject)
      .find('.swal2-content')
      .within(($content) => {
        return $content
      })
  } else {
    return cy.get('.swal2-content')
  }
})

Cypress.Commands.add('getSwal2ActionButton', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrapOff(subject)
      .find('.swal2-actions')
      .children()
      .then(($actionButton) => {
        return cy.get($actionButton)
      })
  } else {
    return cy.get('.swal2-actions').children()
  }
})

Cypress.Commands.add('getSwal2ButtonHolder', { prevSubject: 'optional' }, (subject) => {
  return subject
    ? cy.wrapOff(subject).within(() => cy.get('div.button-holder'))
    : cy.get('div.button-holder')
})

Cypress.Commands.add('closeSwal2', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrapOff(subject).swal2().parents('body').find('.swal2-header > button').click()
  }
})
//
// Chainable command after cy.swal2()
// Example: cy.swal2().swal2confirm()
//btn-danger
Cypress.Commands.add('swal2Confirm', { prevSubject: 'optional' }, (subject, btnName) => {
  if (subject) {
    return cy.wrapOff(subject).parents('body').find(`.swal2-confirm:contains("${btnName}")`)
  } else {
    return cy.swal2().find(`.swal2-confirm:contains("${btnName}")`)
  }
})
//
// Chainable command after cy.swal2()
// Example: cy.swal2().swal2cancel()
//
Cypress.Commands.add('swal2Cancel', { prevSubject: 'optional' }, (subject, btnName) => {
  if (subject) {
    return cy.wrapOff(subject).get(`.swal2-cancel:contains("${btnName}")`)
  }
})

Cypress.Commands.add(
  'verifySwal2Confirmation',
  { prevSubject: 'optional' },
  (subject, title, content, btnConfirm, btnCancel = Field.CANCEL) => {
    const ele = subject ? cy.wrap(subject) : cy
    ele.swal2().within(($popup) => {
      cy.wrapOff($popup).getSwal2Header().should('contain.text', title)
      if (content) {
        cy.wrapOff($popup).getSwal2Content().should('contain.text', content)
      }
      cy.wrapOff($popup).swal2Cancel(btnCancel).swal2Confirm(btnConfirm).closeSwal2()
    })
  }
)

Cypress.Commands.add('expectNoSwal2Popup', { prevSubject: 'optional' }, () => {
  cy.swal2().should('not.exist')
})

Cypress.Commands.add('clickConfirmPopUp', { prevSubject: 'optional' }, (subject, btnConfirm) => {
  if (subject) {
    cy.wrapOff(subject).getElementWithLabel(btnConfirm, 'button').click()
  } else {
    cy.swal2().getElementWithLabel(btnConfirm, 'button').click()
  }
})
