import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  let form
  const manageConsent = new ManageConsent()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      form = consentMockUp.CreateConsentForms.auSmokeConsentTrainingAutomate
      manageConsent.setMockUpData(consentMockUp)
    })
  })
  beforeEach(() => {
    manageConsent.accessToManageOrgConsent()
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin able to see create new consent form screen', () => {
      Story.ticket('QA-391')
      manageConsent.createForm(form)
      manageConsent.preview()
    })
  })
})
