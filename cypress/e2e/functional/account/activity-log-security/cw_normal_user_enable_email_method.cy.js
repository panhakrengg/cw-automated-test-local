import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

const SECURITY = ActivityCategories.SECURITY

describe(Epic.Account, () => {
  const activityLogs = new ActivityLogs()
  const setupAuthentication = new SetupAuthentication()
  const timeoutRemoveEmail2fa = 3000
  context(Story.activityLogSecurity, () => {
    let au2FaActivityLogName

    before(() => {
      cy.stubUser(UserRole.ORG_MEMBER.AU_2FA_ACTIVITY_LOG)
      cy.get('@stubUser').then((user) => {
        au2FaActivityLogName = user.fullName
      })
    })

    it('Cw Normal User enable verification method Email Method then logs activity - Security', () => {
      Story.ticket('QA-1438')
      if (Cypress.currentRetry == 1) {
        AccountUserStub.signInAsAu2FaActivityLogMember()
        setupAuthentication.visitAccountSettingsAnd2StepVerification()
        setupAuthentication.remove2FAEmailMethodVerification()
        setupAuthentication.confirmIdentityFor2FA()
        cy.wait(timeoutRemoveEmail2fa)
      }

      cy.logInTestCase('Set up email verification method')
      AccountUserStub.signInAsAu2FaActivityLogMember()
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      setupAuthentication._identityConfirmed = false
      setupAuthentication.setUp2FAEmailMethodVerification()

      cy.logInTestCase('Remove email verification method')
      setupAuthentication.remove2FAEmailMethodVerification()
      cy.waitLoadingOverlayNotExist()

      cy.logInTestCase('Navigate to security category activity log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(SECURITY)

      cy.logInTestCase('Verify signIn and signOut activity log')
      activityLogs.containLogDisabled2FA(au2FaActivityLogName)
      activityLogs.containLogDisabled2FAMethod(au2FaActivityLogName)
      activityLogs.containLogEnabled2FA(au2FaActivityLogName)

      cy.logInTestCase('Reset data')
      setupAuthentication.visitAccountSettingsAnd2StepVerification()
      setupAuthentication._identityConfirmed = false
      setupAuthentication.disable2FA()
      cy.wait(timeoutRemoveEmail2fa)
    })
  })
})
