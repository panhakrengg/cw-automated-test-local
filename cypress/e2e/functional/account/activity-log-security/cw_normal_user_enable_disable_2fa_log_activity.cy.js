import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import SetupAuthentication from '../../../../classes/register/SetupAuthentication'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

const SECURITY = ActivityCategories.SECURITY

describe(Epic.Account, { retries: 1 }, () => {
  const activityLogs = new ActivityLogs()
  const setupAuthentication = new SetupAuthentication()
  const firstActivityLogIndex = 0
  const secondActivityLogIndex = 1

  context(Story.activityLogSecurity, () => {
    let au2FaActivityLogName

    before(() => {
      cy.stubUser(UserRole.CW_USERS.AU_DEON_BOGISICH)
      cy.get('@stubUser').then((user) => {
        au2FaActivityLogName = user.fullName
      })
    })

    after(() => {
      ReportDefect.markCwDefect('2FA is unstable QA-2059')
    })

    it('Cw Normal User enable and disable 2FA then logs activity - Security', () => {
      Story.ticket('QA-1398', ['QA-2059'])

      context('Reset data', () => {
        AccountUserStub.signInAsDeonBogisich()
        setupAuthentication.visitAccountSettingsAnd2StepVerification()
        setupAuthentication.disable2FA()
      })

      context('Enable and disable 2 FA', () => {
        setupAuthentication.enable2FA()
        setupAuthentication.disable2FA()
      })

      context('Navigate to security category activity log', () => {
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(SECURITY)
      })

      context('Verify signIn and signOut activity log', () => {
        activityLogs.containLogDisabled2FA(au2FaActivityLogName, firstActivityLogIndex)
        activityLogs.containLogEnabled2FA(au2FaActivityLogName, secondActivityLogIndex)
      })
    })
  })
})
