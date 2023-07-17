const clickDivDropdownMenu = (number, index = 0) => {
  cy.get('div.dropdown-menu > ul').within(($item) => {
    const element = `li:contains(${number})`
    if ($item.find(element).length) {
      cy.wrap($item).find(element).eq(index).as('dropdownMenuItem')
      cy.get('@dropdownMenuItem').trigger('mouseover')
      cy.get('@dropdownMenuItem').click()
    }
  })
}

const aliasCwDropdown = 'cwDropdown'
Cypress.Commands.add(
  'getCwDropdown',
  { prevSubject: 'optional' },
  (subject, alias = aliasCwDropdown) => {
    return subject
      ? cy.wrapOff(subject).get('.cw-dropdown').as(alias)
      : cy.get('.cw-dropdown').as(alias)
  }
)

const cwThreeDotsIcon = 'cwThreeDotsIcon'
Cypress.Commands.add(
  'getThreedotsIcon',
  { prevSubject: 'optional' },
  (subject, alias = cwThreeDotsIcon) => {
    return subject
      ? cy.wrap(subject, { log: false }).get('.three-dots-icon').as(alias)
      : cy.get('.three-dots-icon').as(alias)
  }
)

const aliasThreeDots = 'cwThreeDots'
Cypress.Commands.add(
  'getThreeDots',
  { prevSubject: 'optional' },
  (subject, alias = aliasThreeDots) => {
    return subject
      ? cy.wrapOff(subject).get('.dropdown-three-dots').as(alias)
      : cy.get('.dropdown-three-dots').as(alias)
  }
)

Cypress.Commands.add('getDropdownSelected', { prevSubject: 'optional' }, (subject, id) => {
  if (subject) {
    cy.wrapOff(subject).find(`div[id^="${id}"]`).get('div[data-toggle="tooltip"] span')
  } else {
    cy.get(`div[id^="${id}"]`).get('div[data-toggle="tooltip"] span')
  }
})

Cypress.Commands.add('getDropdownButtonSelected', { prevSubject: 'optional' }, (subject, label) => {
  if (subject) {
    return cy.wrapOff(subject).contains('button.dropdown-button > span', label).parent()
  } else {
    cy.contains('button.dropdown-button > span', label).parent()
  }
})

const aliasDropDownList = 'cwDropDownList'

Cypress.Commands.add(
  'getDropdownList',
  { prevSubject: 'optional' },
  (subject, alias = aliasDropDownList) => {
    if (subject) {
      cy.wrapOff(subject).within(($dropdown) => {
        return cy.wrap($dropdown).get('ul.dropdown-menu li').as(alias)
      })
    } else {
      return cy.get('ul.dropdown-menu li').as(alias)
    }
  }
)

Cypress.Commands.add('getDropdownName', { prevSubject: 'optional' }, (subject, menuName) => {
  if (subject) {
    cy.wrapOff(subject).within(($dropdown) => {
      return cy.wrap($dropdown).get('ul.dropdown-menu > li').filter(`:contains("${menuName}")`)
    })
  }
})

Cypress.Commands.add('getDropdownItemByName', { prevSubject: 'optional' }, (subject, menuName) => {
  if (subject) {
    cy.wrapOff(subject).within(() => {
      cy.get('ul.dropdown-menu > li').filter(`:contains("${menuName}")`).as('li')
    })
    return cy.get('@li')
  }
})

Cypress.Commands.add('clickDropdownName', { prevSubject: 'optional' }, (subject, menuName) => {
  const ele = subject ? cy.wrapOff(subject) : cy
  return ele
    .get('ul.dropdown-menu')
    .find('>li')
    .filter(`:contains("${menuName}"):first`)
    .trigger('mouseover')
    .click()
})
Cypress.Commands.add('getDropdownItem', { prevSubject: 'optional' }, (subject, itemName) => {
  const ele = subject ? cy.wrap(subject) : cy
  return ele.get('.dropdown-item').filter(`:contains("${itemName}")`)
})

Cypress.Commands.add('clickDropdownItem', { prevSubject: 'optional' }, (subject, menuName) => {
  if (subject) {
    cy.wrapOff(subject).getThreeDots().scrollIntoView().trigger('mouseover').click()
    cy.wrapOff(subject).clickDropdownName(menuName)
  }
})

Cypress.Commands.add(
  'clickExact3DotsDropdownItem',
  { prevSubject: 'optional' },
  (subject, menuName) => {
    if (subject) {
      cy.wrapOff(subject)
        .scrollIntoView()
        .getThreeDots()
        .trigger('mouseover')
        .click()
        .find('ul.dropdown-menu > li')
        .each(($li) => {
          if ($li.text().trim() == menuName) {
            cy.wrap($li).click()
            return false
          }
        })
    }
  }
)

Cypress.Commands.add('clickCwDropdown', { prevSubject: 'optional' }, (subject, dropdownName) => {
  if (subject) {
    cy.wrapOff(subject).contains(dropdownName).parents('.cw-dropdown').trigger('mouseover').click()
  } else {
    cy.getCwDropdown().contains(dropdownName).parents('.cw-dropdown').trigger('mouseover').click()
  }
})

Cypress.Commands.add(
  'clickCwDropdownItem',
  { prevSubject: 'optional' },
  (subject, dropdownName) => {
    if (subject) {
      cy.wrapOff(subject)
        .getCwDropdown()
        .within(($dropdown) => {
          cy.wrap($dropdown).trigger('mouseover').click()
          cy.wrap($dropdown).clickDropdownName(dropdownName)
        })
    } else {
      cy.getCwDropdown().within(($dropdown) => {
        cy.wrap($dropdown).trigger('mouseover').click()
        cy.wrap($dropdown).clickDropdownName(dropdownName)
      })
    }
  }
)

Cypress.Commands.add('getDropdownToggle', { prevSubject: 'optional' }, (subject) => {
  let ele = subject ? cy.wrapOff(subject) : cy
  return ele.get('.dropdown-toggle')
})

Cypress.Commands.add(
  'clickCwSplitDropdownToggle',
  { prevSubject: 'optional' },
  (subject, menuName, index = 0) => {
    if (subject) {
      cy.wrapOff(subject).within(($splitDropdown) => {
        cy.wrap($splitDropdown).getDropdownToggle().eq(index).click()
        cy.wrap($splitDropdown).clickDropdownName(menuName)
      })
    }
  }
)

Cypress.Commands.add('clickDivDropdownToggle', { prevSubject: 'optional' }, (subject, number) => {
  if (subject) {
    cy.wrapOff(subject).within(($subject) => {
      cy.wrap($subject).getDropdownToggle().click({ force: true })
      clickDivDropdownMenu(number)
    })
  } else {
    cy.getDropdownToggle().click({ force: true })
    clickDivDropdownMenu(number)
  }
})

Cypress.Commands.add('getDropdownMenu', { prevSubject: 'optional' }, (subject) => {
  return subject ? cy.wrapOff(subject).get('.dropdown-menu') : cy.get('.dropdown-menu')
})

Cypress.Commands.add('cwDropdownMenuItems', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrapOff(subject)
      .click()
      .find('ul > li')
      .then(($menuItems) => {
        return $menuItems
      })
  } else {
    cy.get('.cw-dropdown')
      .click()
      .then(($content) => {
        cy.wrap($content)
          .find('ul > li')
          .then(($menuItems) => {
            return $menuItems
          })
      })
  }
})

Cypress.Commands.add(
  'clickDropdownItemInDropdownToggle',
  { prevSubject: 'optional' },
  (subject, itemName) => {
    const ele = subject ? cy.wrap(subject) : cy
    ele.getDropdownToggle().click()
    ele.getDropdownItem(itemName).click()
  }
)

Cypress.Commands.add('expectDropdownToggleValue', { prevSubject: 'optional' }, (subject, value) => {
  let ele = subject ? cy.wrap(subject) : cy
  return ele.getDropdownToggle().should('contains.text', value)
})

Cypress.Commands.add(
  'expectDropdownToggleDisable',
  { prevSubject: 'optional' },
  (subject, value) => {
    let ele = subject ? cy.wrap(subject) : cy
    ele.getDropdownToggle().should('have.class', 'disabled')
    if (value) ele.getDropdownToggle().should('contains.text', value)
  }
)
