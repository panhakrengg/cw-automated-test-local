import CommunityConsentPopupAssertion from '../../../../classes/consent/assertion/CommunityConsentPopupAssertion'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, () => {
  const signInCopAs = new SignInAsCoP()
  const communityConsentPopupAssertion = new CommunityConsentPopupAssertion()
  let copName, copUrl, consentBaseYaml

  const expectSeePredefinedConsent = () => {
    communityConsentPopupAssertion.setCommunityName(copName)
    communityConsentPopupAssertion.setConsent(consentBaseYaml)
    communityConsentPopupAssertion.expectPredefinedConsentPopup()
  }

  before(() => {
    new YamlHelper('consent').read().then(({ ConsentSuite }) => {
      const communityBase =
        ConsentSuite.orgMgt.rootOrg.fireCloudUnit.communities.aPCopPredefinedConsent
      copName = communityBase.label
      copUrl = communityBase.url
      consentBaseYaml = communityBase.predefineConsent
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('CoP Owner, Member, Administrator, ContactManager able to see predefined form in Primary CoP', () => {
      Story.ticket('QA-1167')

      cy.logInTestCase('CoP Owner')
      signInCopAs.owner_Kristy(copUrl)
      expectSeePredefinedConsent()

      cy.logInTestCase('CoP Admin')
      signInCopAs.admin_Kendal(copUrl)
      expectSeePredefinedConsent()

      cy.logInTestCase('CoP Contact Manager')
      signInCopAs.contactManager_Murl(copUrl)
      expectSeePredefinedConsent()

      cy.logInTestCase('CoP Member')
      signInCopAs.member_Enola(copUrl)
      expectSeePredefinedConsent()
    })
  })
})
