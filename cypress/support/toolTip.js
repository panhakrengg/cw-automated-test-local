Cypress.Commands.add(
  'dateToolTipWrapper',
  { prevSubject: 'optional' },
  (subject, date) => {
    let ele = subject ? cy.wrap(subject) : cy
    return ele.get(`.date-tooltip-wrapper :contains(${date})`)
  }
)
