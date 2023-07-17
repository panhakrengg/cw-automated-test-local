import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  let usedConsentForm
  let deprecatedForm
  const manageConsent = new ManageConsent()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      usedConsentForm = consentMockUp.ExistingConsentForms.permissionToViewData.name
      deprecatedForm = consentMockUp.ExistingConsentForms.hopeTheCourseIsWhatYouNeedDeprecated.name
      manageConsent.setMockUpData(consentMockUp)
    })
  })
  beforeEach(() => {
    manageConsent.accessToManageOrgConsent()
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin able to see manage consents', () => {
      Story.ticket('QA-389')
      manageConsent.expectToSeeOrgManageConsentPortlet()
      manageConsent.verifyTableListConsentForms()
      manageConsent.verifyThreeDotOfConsentTypeOrganization()
      manageConsent.verifyThreeDotOfConsentTypeCommunity()
      manageConsent.verifyThreeDotOfConsentTypeMedical()
      manageConsent.verifyThreeDotOfConsentTypeCourse()
    })
  })
})
