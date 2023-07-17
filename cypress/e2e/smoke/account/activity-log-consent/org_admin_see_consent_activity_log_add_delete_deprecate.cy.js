import ActivityLogs from '../../../../classes/account/ActivityLogs'
import OrganizationConsentLog from '../../../../classes/account/logs/OrganizationConsentLog'
import AccountUserInfoYamlStub from '../../../../classes/account/stub/AccountUserInfoYamlStub'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import AccountYamlStub from '../../../../classes/account/stub/AccountYamlStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.Account, () => {
  const activityLogs = new ActivityLogs()
  const orgConsentLog = new OrganizationConsentLog()
  let accountYamlStub, accountUserYamlStub

  const expectCreateDeleteDeprecated = () => {
    orgConsentLog.expectFoundCreatePredefined()
    orgConsentLog.expectFoundDeletePredefined()
    orgConsentLog.expectFoundDeprecatePredefined()
  }

  context(Story.activityLogConsent, () => {
    before(() => {
      accountUserYamlStub = new AccountUserInfoYamlStub()
      accountYamlStub = new AccountYamlStub()
    })

    after(() => {
      ReportDefect.markCwDefect('Require refactoring to functionality')
    })

    it('Org admin able to see consent activity log after add,delete,deprecated predefined consent form', () => {
      Story.ticket('QA-1046')

      const userName = accountUserYamlStub.getAuAcOrgAdminFullName()
      const orgName = accountYamlStub.getOrganizationName()

      context('Go to activity log > organization', () => {
        AccountUserStub.signInAsAuAcOrgAdmin()
        activityLogs.accessActivityLog()
        activityLogs.clickFilterActivityBy(ActivityCategories.ORGANIZATION)
      })

      context('Predefine consent form community', () => {
        orgConsentLog.setData(
          userName,
          accountYamlStub.getConsentName('activityLogPredefinedConsentCommunity'),
          orgName
        )
        expectCreateDeleteDeprecated()
      })
      context('Predefine consent form Course', () => {
        orgConsentLog.setData(
          userName,
          accountYamlStub.getConsentName('activityLogPredefinedConsentCourse'),
          orgName
        )
        expectCreateDeleteDeprecated()
      })
    })
  })
})
