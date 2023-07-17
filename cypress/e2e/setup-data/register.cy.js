import Register from '../../classes/account/Register'

describe('Register user', () => {
  const register = new Register()

  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false)
    cy.visit('registration')
  })
  it('register by credit card', (userinfo = 'auOptOutOwner', file = 'users.yaml') => {
    Cypress.on('uncaught:exception', () => false)
    cy.readFile('cypress/fixtures/' + file).then((UserString) => {
      let users = YAML.parse(UserString)
      const user = users.Users.uat[userinfo]
      register.personal(user)
      cy.pause()
      register.byCoupon()
    })
  })
})
