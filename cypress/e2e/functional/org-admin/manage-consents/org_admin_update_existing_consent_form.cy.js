import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let form
  let formName
  let formNameEdit
  const manageConsent = new ManageConsent()

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      form = YAML.parse(consentString).CreateConsentForms.auTattooConsentForm
      formName = form.name.new
      formNameEdit = form.name.edit
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin update on a existing consent form', () => {
      Story.ticket('QA-392')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formName)
      manageConsent.cleanUpConsentFormByDelete(formNameEdit)

      cy.logInTestCase('Create consent form')
      manageConsent.createForm(form)
      manageConsent.save()

      cy.logInTestCase('Edit consent form')
      manageConsent.showEntry('75')
      manageConsent.editForm(form)
      manageConsent.expectConsentTypeCanNotChange()
      manageConsent.expectConsentTargetCanNotChange()
      manageConsent.save()

      cy.logInTestCase('Preview update consent form')
      manageConsent.showEntry('75')
      manageConsent.expectNewConsentForm(formNameEdit)
      manageConsent.previewConsentForm(formNameEdit)
      manageConsent.expectPreviewPopUpUpdated(form)
    })
  })
})
