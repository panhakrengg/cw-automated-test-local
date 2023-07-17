Cypress.Commands.add('getPopup', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .portletBody()
      .find('.cec-popup')
      .then(($popup) => {
        return $popup
      })
  } else {
    return cy.get('.cec-popup')
  }
})

Cypress.Commands.add('getPopupHeader', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .portletBody()
      .find('.cec-popup__header')
      .then(($popupHeader) => {
        return $popupHeader
      })
  }
})
Cypress.Commands.add('checkPopupHeader', { prevSubject: 'optional' }, (subject, title) => {
  if (subject) {
    cy.wrap(subject).contains('.cec-popup__header span', title).should('be.visible')
  }
})
Cypress.Commands.add('getPopupBody', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .portletBody()
      .find('.cec-popup__body')
      .then(($popupBody) => {
        return $popupBody
      })
  }
})
Cypress.Commands.add('getPopupFooter', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .portletBody()
      .find('.cec-popup__footer')
      .then(($popupFooter) => {
        return $popupFooter
      })
  }
})
Cypress.Commands.add('closePopup', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).getPopupHeader().find('.link-icon').click()
  } else {
    cy.getPopupHeader().find('.link-icon').click()
  }
})

Cypress.Commands.add('clickAgreeConsentFormButton', () => {
  cy.getPopup().within(() => {
    cy.clickPrimaryButton('Yes, I agree')
  })
})
