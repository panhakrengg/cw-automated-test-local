const cwCecCard = 'cecCard'
const cwElementCard = '.cec-card'
Cypress.Commands.add(cwCecCard, { prevSubject: 'optional' }, (subject, alias = cwCecCard) => {
  if (subject) {
    return cy.wrap(subject).get(cwElementCard).as(alias)
  } else {
    return cy.get(cwElementCard).as(alias)
  }
})

Cypress.Commands.add('cecCardHeader', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.cec-card__header')
  }
})

Cypress.Commands.add('cecCardHeaderFixHeight', { prevSubject: 'optional' }, (subject) => {
  return subject
    ? cy.wrap(subject).get('.cec-card__header_fix_height')
    : cy.get('.cec-card__header_fix_height')
})

Cypress.Commands.add('cecCardTitle', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).cecCardHeader().get('.cec-card__title')
  }
})
Cypress.Commands.add('cecCardBody', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .get('.cec-card__body')
      .within(($cecCardBody) => {
        return $cecCardBody
      })
  } else {
    return cy.get('.cec-card__body')
  }
})
Cypress.Commands.add('cecCardBodyWithIndex', { prevSubject: 'optional' }, (subject, index = 0) => {
  let ele = subject ? cy.wrap(subject) : cy
  return ele.get('.cec-card__body').eq(index)
})
Cypress.Commands.add('cardBody', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .get('.card-body')
      .within(($cardBody) => {
        return $cardBody
      })
  } else {
    return cy.get('.card-body')
  }
})
Cypress.Commands.add('cardTitle', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.card-title')
  }
})
Cypress.Commands.add('cardContent', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.card-text')
  }
})
Cypress.Commands.add('cardLeftContent', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.cec-card__left-content')
  }
})

const aliasCardRightContent = 'cardRightContent'
Cypress.Commands.add(
  'cardRightContent',
  { prevSubject: 'optional' },
  (subject, alias = aliasCardRightContent) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get('.cec-card__right-content').as(alias)
  }
)

const aliasCardMainContent = 'cardMainContent'
Cypress.Commands.add(
  'cardMainContent',
  { prevSubject: 'optional' },
  (subject, alias = aliasCardMainContent) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get('.cec-card__main-content').as(alias)
  }
)

Cypress.Commands.add('cecDetailPanel', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    return cy.wrap(subject).get('.cec-detail-panel')
  }
})
