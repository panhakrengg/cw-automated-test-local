import ActivityLogs from '../../../../classes/account/ActivityLogs'
import CommunityConsentLog from '../../../../classes/account/logs/CommunityConsentLog'
import AccountUserInfoYamlStub from '../../../../classes/account/stub/AccountUserInfoYamlStub'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import AccountYamlStub from '../../../../classes/account/stub/AccountYamlStub'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'

describe(Epic.Account, () => {
  const communityConsentLog = new CommunityConsentLog()
  let accountYamlStub, accountUserYamlStub

  context(Story.activityLogConsent, () => {
    before(() => {
      accountUserYamlStub = new AccountUserInfoYamlStub()
      accountYamlStub = new AccountYamlStub()
    })

    after(() => {
      ReportDefect.markCwDefect('Require refactoring to functionality')
    })

    it('CoP Owner able to see activity log after add consent form into Training CoP under Org', () => {
      Story.ticket('QA-1037')

      communityConsentLog.setData(
        accountUserYamlStub.getAuAcOrgAdminFullName(),
        accountYamlStub.getConsentName('copConsentActivityForm'),
        accountYamlStub.getCommunityName('tCopConsentActivity')
      )

      AccountUserStub.signInAsAuAcOrgAdmin()
      new ActivityLogs().accessActivityLog()
      communityConsentLog.expectFoundCreateCommunityConsent()
      communityConsentLog.expectFoundEnableCommunityConsent()
      communityConsentLog.expectFoundGaveCommunityConsent()
    })
  })
})
