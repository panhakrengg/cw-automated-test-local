const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  context(Story.manageUsersMemberSecurity, () => {
    const manageUsers = new ManageUsers()
    const setupAuthentication = new SetupAuthentication()
    let enabled2FaUser
    let enabled2FaEmail

    before(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
        enabled2FaUser = YAML.parse(OrgMgtUsersString)['Users']['uat']['enabledTwoFa']
        enabled2FaEmail = enabled2FaUser['email']
        manageUsers.findUserRowByAdmin(enabled2FaEmail)
        setupAuthentication.toggleRequired2Fa()
      })
    })

    it('Manage 2-Step Verification - Enable required 2FA on member Setup Backup code and Authenticator App/Email Verification', () => {
      manageUsers.findUserRowByAdmin(enabled2FaEmail)
      setupAuthentication.toggleRequired2Fa(true)
      setupAuthentication.checkLoginUsing2FaViaEmail(enabled2FaUser)
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      setupAuthentication.verifySetup2FaItem(
        setupAuthentication._backupCode,
        setupAuthentication._backupCodeDes,
        true
      )

      cy.logInTestCase('Reset Data')
      manageUsers.findUserRowByAdmin(enabled2FaEmail)
      setupAuthentication.toggleRequired2Fa()
    })
  })
})
