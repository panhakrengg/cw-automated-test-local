import Properties from '../classes/utilities/Properties'

Cypress.Commands.add(
  'cwToggleButton',
  { prevSubject: 'optional' },
  (subject, name, labelIndex = 1) => {
    if (subject) {
      cy.wrap(subject).find('.text-noselect').children('span').as('toggleWrapper')
      if (name) cy.get('@toggleWrapper').eq(labelIndex).should('contain.text', name)
      return cy
        .get('@toggleWrapper')
        .eq(labelIndex == 1 ? 0 : 1)
        .as('button')
    }
  }
)

Cypress.Commands.add('cwToggleInput', { prevSubject: 'optional' }, (subject, name) => {
  const ele = subject ? cy.wrap(subject) : cy
  return ele.get(`.text-noselect:contains("${name}")`).find('input')
})

Cypress.Commands.add('toggleIsEnable', { prevSubject: 'optional' }, (subject, isEnable = true) => {
  if (subject) {
    if (isEnable) {
      cy.wrap(subject)
        .find('> label > span')
        .then(($toggleButton) => {
          const win = $toggleButton[0].ownerDocument.defaultView
          const before = win.getComputedStyle($toggleButton[0], '::before')
          const beforeContent = before.getPropertyValue('background')
          expect(beforeContent).to.be.oneOf([
            'rgb(51, 155, 178) none repeat scroll 0% 0% / auto padding-box border-box',
            'rgb(54, 155, 178) none repeat scroll 0% 0% / auto padding-box border-box',
            'rgb(54, 156, 179) none repeat scroll 0% 0% / auto padding-box border-box',
            'rgb(56, 157, 179) none repeat scroll 0% 0% / auto padding-box border-box',
            'rgb(68, 162, 182) none repeat scroll 0% 0% / auto padding-box border-box',
            'rgb(112, 179, 194) none repeat scroll 0% 0% / auto padding-box border-box',
          ])
        })
    }
  }
})

Cypress.Commands.add(
  'toggleIsDisabled',
  { prevSubject: 'optional' },
  (subject, isEnable = true, index = 0) => {
    if (subject) {
      if (isEnable) {
        cy.wrap(subject)
          .find('> label > span')
          .eq(index)
          .then(($toggleButton) => {
            const win = $toggleButton[0].ownerDocument.defaultView
            const before = win.getComputedStyle($toggleButton[0], '::before')
            const beforeContent = before.getPropertyValue('background')
            expect(beforeContent).to.have.contain(Properties.nonActiveColor)
          })
      }
    }
  }
)

Cypress.Commands.add('toggleIsValidState', { prevSubject: 'optional' }, (subject, isEnable) => {
  cy.wrap(subject).toggleProperty('background-color')
  cy.get('@property').then((bgColor) => {
    expect(!!isEnable).to.eq(bgColor.includes(Properties.toggleActiveColor))
  })
})

Cypress.Commands.add('toggleProperty', { prevSubject: 'optional' }, (subject, name) => {
  if (subject) {
    cy.wrap(subject)
      .find('> label > span')
      .then(($toggleButton) => {
        const win = $toggleButton[0].ownerDocument.defaultView
        const cssObj = win.getComputedStyle($toggleButton[0], '::before')
        return cy.wrap(cssObj.getPropertyValue(name)).as('property')
      })
  }
})

Cypress.Commands.add('toggleSwitch', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject).find('label > input[type="checkbox"]').click({ force: true })
  }
})

Cypress.Commands.add('isToggleChecked', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .find('input')
      .invoke('prop', 'checked')
      .then(($state) => {
        cy.wrap($state).as('isToggleChecked')
      })
    return cy.get('@isToggleChecked')
  }
})
