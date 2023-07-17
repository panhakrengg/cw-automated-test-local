import UserFixture from '../../classes/utilities/UserFixture'
import YamlHelper from '../../classes/utilities/YamlHelper'
const YAML = require('yamljs')
const defaultStubUser = 'stubUser'
const defaultStubNonCwUser = 'stubNonCwUser'

Cypress.Commands.add(
  'stubUser',
  (
    role,
    alias = defaultStubUser,
    emailIndex = 0,
    screenNameIndex = 0,
    givenNameIndex = 0,
    familyNameIndex = 0
  ) => {
    let orgUsers, users, userFixture, user
    cy.wrap(null, { log: false }).as(alias)
    cy.readFile('cypress/fixtures/users-orgmgt.yaml', { log: false }).then((OrgUsersString) => {
      orgUsers = YAML.parse(OrgUsersString)
    })
    cy.readFile('cypress/fixtures/users.yaml', { log: false }).then((UserString) => {
      users = YAML.parse(UserString)
    })
    cy.wait(100, { log: false }).then(() => {
      userFixture = new UserFixture(role, users, orgUsers)
      user = userFixture.buildUserObjByIndex(
        emailIndex,
        screenNameIndex,
        givenNameIndex,
        familyNameIndex
      )
      if (user) cy.wrap(user, { log: false }).as(alias)
    })
  }
)

Cypress.Commands.add('stubNonCwUser', (nonCw, alias = defaultStubNonCwUser) => {
  cy.wrap('null', { log: false }).as(alias)
  new YamlHelper('non-cw-users').read().then(({ nonCw }) => {
    cy.wrap(nonCw).as(alias)
  })
})

Cypress.Commands.add('getUserInfoByRole', (userRole) => {
  cy.stubUser(userRole)
  return cy.get('@stubUser')
})
