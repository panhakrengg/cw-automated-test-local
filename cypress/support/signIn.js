import EnvLogin from '../classes/utilities/EnvLogin'

const defaultStubUser = 'stubUser'

Cypress.Commands.add('visitThenSignIn', (url, userRole, emailIndex = 0, screenNameIndex = 0) => {
  url = EnvLogin.defaultRedirectUrl(url)
  EnvLogin.disableException()
  cy.wait(100, { log: false }).then(() => {
    cy.stubUser(userRole, defaultStubUser, emailIndex, screenNameIndex)
    cy.loginSessionBy(url)
  })
})

Cypress.Commands.add('signInAs', (email, userScreenName) => {
  cy.intercept('/realms/*/login-actions/*').as('getAuthenticate')
  EnvLogin.setEmail(email, userScreenName)
  cy.get('#password').type(EnvLogin.envPass(), { log: false })
  cy.get('#rememberMe').click()
  cy.get('#kc-login').click()
  cy.wait(500)
  cy.get('@getAuthenticate').then((auth) => {
    if (auth) {
      cy.wrap(auth).its('state').should('eq', 'Complete')
    }
  })
})

Cypress.Commands.add('signInWith', (email, password) => {
  cy.get('#username').clear().type(email)
  if (password) {
    cy.get('#password').type(password, { log: false })
  }
  cy.get('#rememberMe').click()
  cy.get('#kc-login').click()
})

Cypress.Commands.add('signOut', () => {
  cy.intercept('/c/portal/logout').as('systemLogout')
  cy.visit('/c/portal/logout')
  cy.wait('@systemLogout')
  Cypress.session.clearAllSavedSessions()
  cy.clearCookies()
  cy.visit('/')
})

Cypress.Commands.add('signInViaEmail', (email, screenName = '') => {
  EnvLogin.disableException()

  let strEmail
  cy.signOut()
  if (email == undefined) throw new Error(`Email address is ${email}`)
  strEmail = email == 'string' ? email : email.toString()
  cy.signInAs(strEmail, screenName.toString())
})

Cypress.Commands.add('signOutViaUserAvatar', (email, screenName = '') => {
  cy.intercept('/c/portal/logout').as('systemLogout')
  cy.get('#avatar-dropdown').within(($dropdown) => {
    cy.get('#cw-user-dropdown').click()
    cy.wrap($dropdown).clickDropdownName('Sign out')
  })
  cy.wait('@systemLogout')
  Cypress.session.clearAllSavedSessions()
})

Cypress.Commands.add('loginSessionBy', (url) => {
  const aliasUser = `@${defaultStubUser}`
  cy.get(aliasUser).then((user) => {
    cy.session(
      user.screenName,
      () => {
        cy.visit(url) // redirect will go to login if session not exist
        cy.signInAs(user.email, user.screenName)
      },
      {
        cacheAcrossSpecs: true,
      }
    )
    cy.visit(url)
    cy.logCwNode(user.email)
  })
})
