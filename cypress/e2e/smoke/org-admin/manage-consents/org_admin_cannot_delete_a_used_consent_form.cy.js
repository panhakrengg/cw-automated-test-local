import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  let usedConsentForm
  const manageConsent = new ManageConsent()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      usedConsentForm = consentMockUp.ExistingConsentForms.permissionToViewData.name
      manageConsent.setMockUpData(consentMockUp)
    })
  })
  beforeEach(() => {
    manageConsent.accessToManageOrgConsent()
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin can not delete a used consent form', () => {
      Story.ticket('QA-405')
      manageConsent.delete(usedConsentForm)
      manageConsent.expectPopUpInfoFormCannotDelete()
    })
  })
})
