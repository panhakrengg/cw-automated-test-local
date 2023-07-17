import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let form
  let formNameAuConsentDemoWebLearn
  const manageConsent = new ManageConsent()
  const manageCopConsent = new ManageCopConsent()

  const visitCommunityUnderDemoFrontier = () => {
    SignInAs.reSignInAsDemoFrontierAdmin('/web/demo-frontier-org-consent/admin/admin')
  }

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      manageConsent.setMockUpData(consentMockUp)
      form = consentMockUp.CreateConsentForms.auConsentDemoWebLearn
      formNameAuConsentDemoWebLearn = form.name.new
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin will not able to select Predefined consent form non-related organization CoP', () => {
      Story.ticket('QA-404')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formNameAuConsentDemoWebLearn)

      manageConsent.deleteConsentForms(formNameAuConsentDemoWebLearn)
      manageConsent.createForm(form)
      manageConsent.save()

      visitCommunityUnderDemoFrontier()
      manageCopConsent.accessToManageConsent()
      manageCopConsent.enableConsent()
      manageCopConsent.expectNotAvailablePredefinedForm(formNameAuConsentDemoWebLearn)
    })
  })
})
