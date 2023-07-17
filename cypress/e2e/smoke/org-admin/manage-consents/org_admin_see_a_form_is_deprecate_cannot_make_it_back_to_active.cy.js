import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'

describe(Epic.OrgAdmin, () => {
  let deprecatedForm
  const manageConsent = new ManageConsent()
  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      deprecatedForm = consentMockUp.ExistingConsentForms.hopeTheCourseIsWhatYouNeedDeprecated.name
      manageConsent.setMockUpData(consentMockUp)
    })
  })
  beforeEach(() => {
    manageConsent.accessToManageOrgConsent()
  })
  context(Story.orgAdminManageConsents, () => {
    it('Org Admin see a form is deprecate cannot make it back to active', () => {
      Story.ticket('QA-413')
      manageConsent.expectDisableMarkAsDeprecated(deprecatedForm)
    })
  })
})
