import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  let form
  let formName
  const manageConsent = new ManageConsent()
  const manageCourseConsent = new ManageCourseConsent()

  before(() => {
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentMockUp = YAML.parse(consentString)
      const courseName =
        consentMockUp.ConsentSuite.orgMgt.rootOrg.webLearnUnit.courses.htmlOnlineCourseConsent.name
      form = consentMockUp.CreateConsentForms.auCourseConsentFormDeprecated
      formName = form.name.new
      manageCourseConsent.setCourseName(courseName)
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin deprecate form type course not show in course predefined consent list', () => {
      Story.ticket('QA-407')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formName)

      cy.logInTestCase('Create consent form')
      manageConsent.createForm(form)
      manageConsent.save()

      cy.logInTestCase('Mark consent form as deprecate')
      manageConsent.showEntry('75')
      manageConsent.markConsentFormsAsDeprecated(formName)

      cy.logInTestCase('Expect not to see deprecate consent form on predefine form')
      manageCourseConsent.accessToManageConsent()
      manageCourseConsent.enable()
      manageCourseConsent.expectNotAvailablePredefinedForm(formName)
    })
  })
})
