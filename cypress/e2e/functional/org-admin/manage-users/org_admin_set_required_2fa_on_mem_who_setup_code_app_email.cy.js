const YAML = require('yamljs')
import Epic from '../../../../classes/Epic'
import ManageUsers from '../../../../classes/org-management/org-structure/ManageUsers'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, {retries:1}, () => {
  const manageUsers = new ManageUsers()
  const setupAuthentication = new SetupAuthentication()
  let fullSecurityUser
  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgMgtUsersString) => {
      fullSecurityUser = YAML.parse(OrgMgtUsersString)['Users']['uat']['fullSecurity']
    })
  })

  context(Story.manageUsersMemberSecurity, () => {
    it('Org Admin disable required 2FA for member that already setup 2FA via backup code, app and email before verify', () => {
      manageUsers.findUserRowByAdmin(fullSecurityUser.email)
      setupAuthentication.toggleRequired2Fa()
    })
    it('Manage 2-Step Verification - Enable required 2FA on member Setup Backup code, Authenticator App, and Email Verification', () => {
      manageUsers.findUserRowByAdmin(fullSecurityUser.email)
      setupAuthentication.toggleRequired2Fa(true)
      setupAuthentication.checkLoginUsing2FaViaEmail(fullSecurityUser)
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      setupAuthentication.validateAllSetup2Fa()
    })
    it('Org Admin disable required 2FA for member that already setup 2FA via backup code, app and email after verify', () => {
      manageUsers.findUserRowByAdmin(fullSecurityUser.email)
      setupAuthentication.toggleRequired2Fa()
    })
  })
})
