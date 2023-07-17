import EnvLogin from '../classes/utilities/EnvLogin'

Cypress.Commands.add('loginEthereal', (screenName) => {
  const user = {
    user: '',
    pass: '',
  }

  cy.parseCsv(EnvLogin.getCsvEPath(screenName)).then((jsonData) => {
    user.user = jsonData[1][2]
    user.pass = jsonData[1][3]
  })

  return cy.task('loginEthereal', user)
})
