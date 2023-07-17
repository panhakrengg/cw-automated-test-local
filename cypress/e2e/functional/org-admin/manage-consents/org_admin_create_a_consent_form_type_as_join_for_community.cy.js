import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let form
  let formName
  const manageConsent = new ManageConsent()

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      manageConsent.setMockUpData(consentMockUp)
      form = consentMockUp.CreateConsentForms.auChildCareConsentForm
      formName = form.name.new
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin create a consent form type as Join for community', () => {
      Story.ticket('QA-395')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formName)
      manageConsent.createForm(form)
      manageConsent.save()

      manageConsent.showEntry('75')
      manageConsent.expectNewConsentForm(formName)
      manageConsent.previewConsentForm(formName)
      manageConsent.expectPreviewPopUp()
      manageConsent.deleteConsentForms(formName)
      manageConsent.expectNotSeeNewConsentForm(formName)
    })
  })
})
