Cypress.Commands.add(
  'emailContains',
  { prevSubject: 'optional' },
  (subject, content, selector = 'table', selectorIndex = 0) => {
    if (subject) {
      const emailTemplate = parseEmailTemplateBy(subject)
      if (emailTemplate.getElementsByTagName(selector).length) {
        const emailHeader = emailTemplate.getElementsByTagName(selector)[selectorIndex].textContent
        expect(emailHeader).to.contains(content)
      }
    }
  }
)

Cypress.Commands.add('emailTableBody', { prevSubject: 'optional' }, (subject) => {
  if (subject) return cy.wrap(extractTableFromHTML(subject))
})

Cypress.Commands.add('visitCreateAccount', { prevSubject: 'optional' }, (subject) => {
  if (subject) {
    const anchorElements = extractLinksFromHTML(subject)
    for (let element of anchorElements) {
      if (element.innerHTML == 'Create Account') {
        cy.signOut()
        cy.visit(element.getAttribute('href'))
      }
    }
    cy.get('#_registration_-registration').should('be.visible')
  }
})

const linkAlias = 'elementHref'
Cypress.Commands.add(
  'getEmailElementHref',
  { prevSubject: 'optional' },
  (subject, linkText, alias = linkAlias) => {
    if (subject) {
      const linkElements = extractLinksFromHTML(subject)
      for (let link of linkElements) {
        if (linkText instanceof RegExp && linkText.test(link.innerText)) {
          return getHrefValue(link, alias)
        } else {
          if (link.innerHTML.includes(linkText)) {
            return getHrefValue(link, alias)
          } else {
            // throw new Error(`Email template not contains text "${linkText}"`)
          }
        }
      }
    }
  }
)

Cypress.Commands.add('checkLinkIsExisting', { prevSubject: true }, (subject, label, url) => {
  cy.wrap(subject).getEmailElementHref(label)
  cy.get(`@elementHref`).then(($url) => {
    expect($url).to.contain(url)
    cy.request($url).its('status').should('eq', 200)
  })
})

function extractTableFromHTML(subject) {
  const emailTemplate = parseEmailTemplateBy(subject)
  const table = emailTemplate.getElementsByTagName('table')[0]
  return table
}

function getHrefValue(link, alias) {
  return cy.wrap(link.getAttribute('href')).as(alias)
}

function extractLinksFromHTML(subject) {
  const emailTemplate = parseEmailTemplateBy(subject)
  const anchorElements = emailTemplate.getElementsByTagName('a')
  return anchorElements
}

function parseEmailTemplateBy(subject) {
  const parser = new DOMParser()
  const emailTemplate = parser.parseFromString(subject, 'text/html')
  return emailTemplate
}
