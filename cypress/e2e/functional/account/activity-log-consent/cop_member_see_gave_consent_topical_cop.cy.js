import ActivityLogs from '../../../../classes/account/ActivityLogs'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import CommunityConsent from '../../../../classes/account/consents/personnel-consent/CommunityConsent'
import ConsentConstant from '../../../../classes/account/consents/personnel-consent/ConsentConstant'
import CommunityConsentLog from '../../../../classes/account/logs/CommunityConsentLog'
import AccountUserInfoYamlStub from '../../../../classes/account/stub/AccountUserInfoYamlStub'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import AccountYamlStub from '../../../../classes/account/stub/AccountYamlStub'
import Epic from '../../../../classes/Epic'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'

describe(Epic.Account, { retries: 1, tags: '@skipPrd' }, () => {
  const activityLogs = new ActivityLogs()
  const communityConsentLog = new CommunityConsentLog()
  const consentSettings = new ConsentSettings()
  const manageCopConsent = new ManageCopConsent()
  const communityConsent = new CommunityConsent()
  let accountYamlStub, accountUserYamlStub
  let copName
  let consentName
  let userFullName

  context(Story.activityLogConsent, () => {
    before(() => {
      accountUserYamlStub = new AccountUserInfoYamlStub()
      accountYamlStub = new AccountYamlStub()
    })

    beforeEach(() => {
      copName = accountYamlStub.getCommunityName('tpCopConsentActivity')
      consentName = accountYamlStub.getConsentName('tpCoPConsentForm')
      userFullName = accountUserYamlStub.getAuAcMemberFullName()
      communityConsentLog.setData(userFullName, consentName, copName)
    })

    it('CoP Member able to see a gave consent log of a Topical CoP', () => {
      Story.ticket('QA-1365')

      cy.logInTestCase('Reset data - Cop Member revoke consent')
      AccountUserStub.signInAsAuAcMember()

      cy.logInTestCase('Redirect to consent in account settings')
      consentSettings.visit()
      communityConsent.accessConsentTab(ConsentConstant.consentTabs[0].name)

      cy.logInTestCase('Cop Member revoke consent')
      consentSettings.revokeConsentIfExist(copName)

      cy.logInTestCase('Cop Member given consent')
      cy.visit(`/web/${copName}`)
      manageCopConsent.acceptConsentFormWithoutInput()

      activityLogs.accessActivityLog()
      activityLogs.expectFoundGaveCommunityConsent(copName)
    })
  })
})
