const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const manageUsers = new ManageUsers()
  const setupAuthentication = new SetupAuthentication()
  let twoFaUserEmail, twoFaUserName, twoFaUser
  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
      twoFaUser = YAML.parse(OrgMgtUsersString).Users.uat.twoFaUser
      twoFaUserEmail = twoFaUser.email
      twoFaUserName = twoFaUser.givenName
    })
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Org Admin disable required 2FA and user delete existing email authentication', () => {
      manageUsers.findUserRowByAdmin(twoFaUserEmail)
      setupAuthentication.deleteExistingEmailAuth(twoFaUser)
    })

    it('Org Admin enable "Manage 2-Step Verification" on member', () => {
      manageUsers.findUserRowByAdmin(twoFaUserEmail)
      setupAuthentication.setRequired2FaAndSetupViaEmail(twoFaUser)
      cy.wait(5000)
    })

    it('Org Admin disable required 2FA and user delete existing email authentication, verify', () => {
      manageUsers.findUserRowByAdmin(twoFaUserEmail)
      setupAuthentication.deleteExistingEmailAuth(twoFaUser)
      cy.wait(15000)
      cy.signInViaEmail(twoFaUserEmail)
      cy.url().should('include', manageUsers._dashboardUrl)
    })
  })
})
