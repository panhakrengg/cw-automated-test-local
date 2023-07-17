Cypress.Commands.add(
  'buttonLink',
  { prevSubject: 'optional' },
  (subject, linkText) => {
    if (subject) {
      cy.wrap(subject)
        .get('a[role="button"] span')
        .contains(linkText)
        .parent('a')
    } else {
      cy.get('a[role="button"] span').contains(linkText).parent('a')
    }
  }
)
