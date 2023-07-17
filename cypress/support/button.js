Cypress.Commands.add('buttonDisabled', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).find('button').should('have.attr', 'disabled', 'disabled')
  } else {
    cy.get('button').should('have.attr', 'disabled', 'disabled')
  }
})
Cypress.Commands.add('buttonNotDisabled', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).find('button').should('not.have.attr', 'disabled', 'disabled')
  } else {
    cy.get('button').should('not.have.attr', 'disabled', 'disabled')
  }
})
Cypress.Commands.add('btnConfirm', { prevSubject: 'optional' }, (subject, btnName) => {
  if (subject) {
    return cy.wrap(subject).get(`button.btn-primary:contains("${btnName}")`)
  }
  return cy.get(`button.btn-primary:contains("${btnName}")`)
})
Cypress.Commands.add('btnCancel', { prevSubject: 'optional' }, (subject, btnName) => {
  if (subject) {
    return cy.wrap(subject).find(`button.btn-outline-primary:contains("${btnName}")`)
  }
})
Cypress.Commands.add('clickPrimaryButton', (btnName) => {
  cy.get(`button.btn-primary:contains("${btnName}")`).click()
})
Cypress.Commands.add(
  'chooseFile',
  { prevSubject: 'optional' },
  (subject, path, classSelector = 'hide') => {
    if (Array.isArray(path)) {
      path = path.map((p) => 'cypress/fixtures/' + p)
    } else {
      path = 'cypress/fixtures/' + path
    }
    cy.wrap(subject).click({ force: true })
    cy.get(`input[type="file"].${classSelector}`).selectFile(path, {
      force: true,
    })
  }
)

Cypress.Commands.add('getButtonByName', (btnName) => {
  return cy.get(`button:contains("${btnName}")`)
})

Cypress.Commands.add('clickButtonByName', (btnName, index = 0) => {
  cy.get(`button:contains("${btnName}")`).eq(index).click({ force: true })
})

Cypress.Commands.add('expectButtonWithLabelAndEnabled', (btnName) => {
  cy.get(`button:contains("${btnName}")`).should('not.have.attr', 'disabled', 'disabled')
})

Cypress.Commands.add('expectButtonWithLabelAndDisabled', (btnName) => {
  cy.get(`button:contains("${btnName}")`).should('have.attr', 'disabled', 'disabled')
})
Cypress.Commands.add('expectButtonWithLabelAndNotExist', (btnName) => {
  cy.get(`button:contains("${btnName}")`).should('be.not.exist')
})

Cypress.Commands.add(
  'isDisabled',
  {
    prevSubject: true,
  },
  (subject) => {
    cy.wrap(subject).should('have.attr', 'disabled', 'disabled')
  }
)
Cypress.Commands.add(
  'isEnabled',
  {
    prevSubject: true,
  },
  (subject) => {
    cy.wrap(subject).should('not.have.attr', 'disabled', 'disabled')
  }
)
