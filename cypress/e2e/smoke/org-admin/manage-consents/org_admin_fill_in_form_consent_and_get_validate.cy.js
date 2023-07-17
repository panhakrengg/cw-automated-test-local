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
    it('Org Admin fill in form name & consent target & description and get validate', () => {
      Story.ticket('QA-396')
      manageConsent.accessToCreateForm()
      manageConsent.enterFormName(form.name)
      manageConsent.enterFormDescription(form.desc)
      manageConsent.expectDisableSaveButton()

      manageConsent.selectConsentTarget(form.consentTarget)
      manageConsent.expectEnableSaveButton()

      manageConsent.clearFormName()
      manageConsent.expectDisableSaveButton()

      manageConsent.clearFormDescription()
      manageConsent.enterFormName(form.name)
      manageConsent.expectDisableSaveButton()

      manageConsent.clearFormName()
      manageConsent.expectDisableSaveButton()
    })
  })
})
