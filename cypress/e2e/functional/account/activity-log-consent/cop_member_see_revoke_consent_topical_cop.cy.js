import ActivityLogs from '../../../../classes/account/ActivityLogs'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import CommunityConsent from '../../../../classes/account/consents/personnel-consent/CommunityConsent'
import ConsentConstant from '../../../../classes/account/consents/personnel-consent/ConsentConstant'
import CommunityConsentLog from '../../../../classes/account/logs/CommunityConsentLog'
import AccountUserInfoYamlStub from '../../../../classes/account/stub/AccountUserInfoYamlStub'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import AccountYamlStub from '../../../../classes/account/stub/AccountYamlStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import Epic from '../../../../classes/Epic'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'

describe(Epic.Account, { tags: '@skipPrd', retries: 1 }, () => {
  const activityLogs = new ActivityLogs()
  const communityConsentLog = new CommunityConsentLog()
  const manageCopConsent = new ManageCopConsent()
  const consentSettings = new ConsentSettings()
  const communityConsent = new CommunityConsent()
  let accountYamlStub, accountUserYamlStub
  let userFullName, copName, consentName

  const expectRevokeConsent = () => {
    activityLogs.expectFoundRevokeCommunityConsent(copName)
  }

  context(Story.activityLogConsent, () => {
    before(() => {
      accountUserYamlStub = new AccountUserInfoYamlStub()
      accountYamlStub = new AccountYamlStub()
    })

    beforeEach(() => {
      userFullName = accountUserYamlStub.getAuAcMemberFullName()
      consentName = accountYamlStub.getConsentName('tpCoPConsentForm')
      copName = accountYamlStub.getCommunityName('tpCopConsentActivity')
      communityConsentLog.setData(userFullName, consentName, consentName)
    })

    it('CoP Member revoke a consent of TPCoP then see a log activity in account setting', () => {
      Story.ticket('QA-1366')

      cy.logInTestCase('Reset data - given consent if exist')
      if (Cypress.currentRetry == 1) {
        AccountUserStub.signInAsAuAcMember()

        consentSettings.visit()
        communityConsent.accessConsentTab(ConsentConstant.consentTabs[0].name)
        consentSettings.getConsentItem(copName)
        consentSettings.revokeConsent()
      }
      AccountUserStub.signInAsAuAcMember()
      cy.visit(`/web/${copName}`)
      manageCopConsent.acceptConsentFormWithoutInput()

      cy.logInTestCase('Cop Member revoke consent')
      consentSettings.visit()
      communityConsent.accessConsentTab(ConsentConstant.consentTabs[0].name)
      consentSettings.getConsentItem(copName)
      consentSettings.revokeConsent()

      cy.logInTestCase('All Activities')
      activityLogs.accessActivityLog()
      expectRevokeConsent()

      cy.logInTestCase('Security')
      activityLogs.clickFilterActivityBy(ActivityCategories.SECURITY)
      expectRevokeConsent()
    })
  })
})
