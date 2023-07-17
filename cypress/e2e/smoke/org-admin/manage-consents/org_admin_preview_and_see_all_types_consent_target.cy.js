import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  const manageConsent = new ManageConsent()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)

      manageConsent.setMockUpData(consentMockUp)
    })
  })
  beforeEach(() => {
    manageConsent.accessToManageOrgConsent()
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin able to preview and see all types consent target', () => {
      Story.ticket('QA-390')
      manageConsent.previewConsentTypeOrganization()
      manageConsent.previewConsentTypeCommunity()
      manageConsent.previewConsentTypeMedical()
      manageConsent.previewConsentTypeCourse()
    })
  })
})
