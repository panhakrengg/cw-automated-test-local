import Converter from '../classes/utilities/Converter'

Cypress.Commands.add('getMultiSelectInput', { prevSubject: 'optional' }, (subject) => {
  if (!subject) return
  return cy.wrap(subject).find('div.multiselect').click().find('.multiselect__input')
})

Cypress.Commands.add('getMultiSelect', { prevSubject: 'optional' }, (subject) => {
  return subject ? cy.wrap(subject).get('.multiselect__select') : cy.get('.multiselect__select')
})

Cypress.Commands.add('multiSelectType', { prevSubject: 'optional' }, (subject, value) => {
  if (!subject) return
  return cy
    .wrap(subject)
    .find('div.multiselect')
    .find('.multiselect__input')
    .focus()
    .clear()
    .type(`${value} {enter}`)
})

Cypress.Commands.add('multiSelectByIndex', { prevSubject: 'optional' }, (subject, index = 1) => {
  if (!subject) return
  cy.wrap(subject)
    .find(`.multiselect__content-wrapper > ul > li.multiselect__element:nth-child(${index})`)
    .click()
})

Cypress.Commands.add('multiSelectByName', { prevSubject: 'optional' }, (subject, name) => {
  if (!subject) return
  cy.wrap(subject)
    .find(`.multiselect__content-wrapper > ul > li.multiselect__element:contains("${name}")`)
    .click()
})

Cypress.Commands.add('multiSelectNotFound', { prevSubject: 'optional' }, (subject, label) => {
  if (subject) {
    cy.wrap(subject)
      .find(`.multiselect__content-wrapper > ul > li > span > span:contains("${label}")`)
      .should('be.visible')
  } else {
    cy.find(`.multiselect__content-wrapper > ul > li > span > span:contains("${label}")`).should(
      'be.visible'
    )
  }
})

Cypress.Commands.add('getMultiSelectItems', { prevSubject: 'optional' }, (subject) => {
  return subject
    ? cy.wrap(subject).get('.multiselect__content-wrapper > ul > li')
    : cy.get('.multiselect__content-wrapper > ul > li')
})

Cypress.Commands.add('getCwMultiSelect', { prevSubject: 'optional' }, (subject) => {
  return subject ? cy.wrap(subject).get('.cw-multi-select') : cy.get('.cw-multi-select')
})

Cypress.Commands.add('searchCwMultiSelectItem', { prevSubject: 'optional' }, (subject, item) => {
  subject
    ? cy.wrap(subject).get('.search-input input').clear().type(item)
    : cy.get('.search-input input').clear().type(item)
})

Cypress.Commands.add('clearCwMultiSelect', () => {
  cy.getCwMultiSelect().within(($multiSelect) => {
    if ($multiSelect.find('.cw-multi-select__count-more').length) {
      cy.get('.cw-multi-select__count-more')
        .invoke('text')
        .then(($text) => {
          const total = parseInt(Converter.getNumberFromString($text))
          for (let i = 0; i < total + 1; i++) {
            cy.get('.badge svg').click()
            cy.wait(1000)
          }
        })
    } else {
      cy.get('.badge svg').click()
    }
  })
})

Cypress.Commands.add('selectCwMultiSelectItems', (items) => {
  cy.getCwMultiSelect().within(($multiSelect) => {
    cy.wrap($multiSelect).click()
    items.forEach((item) => {
      cy.wrap($multiSelect).searchCwMultiSelectItem(item)
      cy.get('.dropdown-menu').within(() => {
        cy.getElementWithLabel(item, '.input-checkbox-wrapper span')
          .first()
          .parent()
          .find('span > input')
          .check()
      })
    })
  })
})
