Cypress.Commands.add(
  'getInput',
  { prevSubject: 'optional' },
  (subject, type = 'text', placeholder) => {
    return subject
      ? cy
          .wrap(subject)
          .get(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
      : cy.get(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
  }
)
Cypress.Commands.add(
  'getInputByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder) => {
    return subject
      ? cy.wrap(subject).get(`input[placeholder="${placeholder}"]`)
      : cy.get(`input[placeholder="${placeholder}"]`)
  }
)

Cypress.Commands.add(
  'getInputFormGroup',
  { prevSubject: 'optional' },
  (subject, label, index = 0) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get(`div.form-group:contains("${label}")`).find('input').eq(index)
  }
)

Cypress.Commands.add(
  'getInputByLabel',
  { prevSubject: 'optional' },
  (subject, label, index = 0) => {
    const ele = subject ? cy.wrap(subject) : cy
    return ele.get(`label:contains("${label}")`).parent().find('input').eq(index)
  }
)

Cypress.Commands.add('inputNumber', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .find('input[type="number"]')
      .then(($inputNumber) => {
        return $inputNumber
      })
  } else {
    cy.get('input[type="number"]')
  }
})

Cypress.Commands.add('inputNumberById', { prevSubject: 'optional' }, (subject, id) => {
  if (subject) {
    cy.wrap(subject)
      .get(`input[type="number"][id^=${id}]`)
      .then(($inputNumber) => {
        return $inputNumber
      })
  } else {
    cy.get('input[type="number"]')
  }
})

Cypress.Commands.add('getInputFeedback', { prevSubject: 'optional' }, (subject) => {
  const ele = subject ? cy.wrap(subject) : cy
  return ele.get('div.has-feedback.has-search').children('input')
})

Cypress.Commands.add('inputFeedback', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .get('div.has-feedback.has-search')
      .within(($inputSearch) => {
        cy.get('span.glyphicon-search').should('be.visible')
        return cy.wrap($inputSearch).children('input')
      })
  }
})

Cypress.Commands.add(
  'inputSearch',
  { prevSubject: 'optional' },
  (subject, placeholder = 'Search') => {
    if (subject) {
      return cy.wrap(subject).find(`input[type="text"][placeholder="${placeholder}"]`)
    } else {
      return cy.get(`input[type="text"][placeholder="${placeholder}"]`)
    }
  }
)

Cypress.Commands.add(
  'inputByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder, value, index = 0) => {
    if (subject) {
      return cy
        .wrap(subject)
        .find(`input[placeholder="${placeholder}"]`)
        .eq(index)
        .clear()
        .type(value)
        .blur()
    } else {
      return cy.get(`input[placeholder="${placeholder}"]`).eq(index).clear().type(value).blur()
    }
  }
)

Cypress.Commands.add('inputByName', { prevSubject: 'optional' }, (subject, name, value) => {
  if (subject) {
    return cy.wrap(subject).find(`input[name="${name}"]`).clear().type(value).blur()
  } else {
    return cy.get(`input[name="${name}"]`).clear().type(value).blur()
  }
})

Cypress.Commands.add('inputFormGroup', (label, value) => {
  cy.contains(label).parents('div.form-group').find('input').clear().type(value)
})

Cypress.Commands.add('inputByLabel', { prevSubject: 'optional' }, (subject, label, value) => {
  const ele = subject ? cy.wrap(subject) : cy
  ele.getElementByLabel(label).clear().type(value)
})
Cypress.Commands.add('inputTextAreaFormGroup', (label, value) => {
  cy.contains(label).parents('div.form-group').find('textarea').clear().type(value)
})

Cypress.Commands.add('typeInput', { prevSubject: 'optional' }, (subject, value, type = 'text') => {
  if (subject) {
    cy.wrap(subject).find(`input[type="${type}"]`).clear().type(value)
  } else {
    cy.get(`input[type="${type}"]`).clear().type(value)
  }
})

Cypress.Commands.add('typeBackSpace', { prevSubject: 'optional' }, (subject, numberOfType = 0) => {
  while (numberOfType > 0) {
    numberOfType -= 1
    subject ? cy.wrap(subject).type('{backspace}') : cy.get('input').type('{backspace}')
  }
})
Cypress.Commands.add('controlledInputChange', { prevSubject: 'element' }, (subject, value) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set
  const changeInputValue = (inputToChange) => (newValue) => {
    nativeInputValueSetter.call(inputToChange[0], newValue)
    inputToChange[0].dispatchEvent(new Event('change', { value: newValue, bubbles: true }))
  }

  return cy.get(subject).then((input) => changeInputValue(input)(value))
})
Cypress.Commands.add('getElementByLabel', { prevSubject: 'optional' }, (subject, label) => {
  subject
    ? cy.wrap(subject).find(`label:contains(${label})`).next()
    : cy.get(`label:contains("${label}")`).next()
})
Cypress.Commands.add('expectToSeeDateTimePicker', { prevSubject: 'optional' }, (subject, label) => {
  const wrapper = subject ? cy.wrap(subject) : cy.getElementByLabel(label)
  wrapper
    .find('input')
    .should('be.visible')
    .next()
    .and('have.class', 'mx-icon-calendar')
    .parents('.cec-pr-1')
    .next()
    .find('input')
    .should('be.visible')
    .next()
    .and('have.class', 'mx-icon-calendar')
})
Cypress.Commands.add('expectInputTypeNumber', { prevSubject: 'optional' }, (subject, label) => {
  subject
    ? cy.wrap(subject).should('have.attr', 'type', 'number')
    : cy.getElementByLabel(label).should('have.attr', 'type', 'number')
})
Cypress.Commands.add(
  'expectInputValueByPlaceholder',
  { prevSubject: 'optional' },
  (subject, placeholder, value) => {
    const ele = subject ? cy.wrap(subject) : cy
    ele.getInputByPlaceholder(placeholder).should('have.value', value)
  }
)

Cypress.Commands.add('isInputChecked', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    cy.wrap(subject)
      .find('input')
      .invoke('is', ':checked')
      .then((checked) => {
        cy.wrap(checked).as('isInputChecked')
      })
    return cy.get('@isInputChecked')
  }
})
