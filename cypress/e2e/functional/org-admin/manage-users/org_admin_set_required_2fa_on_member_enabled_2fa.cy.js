const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  const manageUsers = new ManageUsers()
  const setupAuthentication = new SetupAuthentication()
  let enabledTwoFaUser

  before(() => {
    cy.stubUser(UserRole.ORG_MEMBER.ENABLED_TWO_FA)
    cy.get('@stubUser').then((user) => {
      enabledTwoFaUser = user
    })
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Manage 2-Step Verification - Enable required 2FA on member who enabled 2FA', () => {
      Story.ticket('QA-67')

      cy.logInTestCase('Org Admin disable required 2FA for member')
      manageUsers.findUserRowByAdmin(enabledTwoFaUser.email)
      setupAuthentication.toggleRequired2Fa()
      cy.wait(15000)
      manageUsers.findUserRowByAdmin(enabledTwoFaUser.email)
      setupAuthentication.toggleRequired2Fa(true)
      cy.wait(15000)
      setupAuthentication.checkLoginUsing2FaViaEmail({
        email: enabledTwoFaUser['email'],
        givenName: enabledTwoFaUser['givenName'],
        screenName: enabledTwoFaUser['screenName'],
      })
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      setupAuthentication.validateSetup2FaViaEmail()

      cy.logInTestCase('Org Admin disable required 2FA')
      manageUsers.findUserRowByAdmin(enabledTwoFaUser.email)
      setupAuthentication.toggleRequired2Fa()
    })
  })
})
