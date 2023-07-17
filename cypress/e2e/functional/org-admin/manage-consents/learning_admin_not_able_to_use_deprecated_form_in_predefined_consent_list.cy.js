import Epic from '../../../../classes/Epic'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.OrgAdmin, () => {
  let form
  let formName
  const manageConsent = new ManageConsent()
  const manageCourseConsent = new ManageCourseConsent()

  before(() => {
    new YamlHelper('consent').read().then((consentMockUp) => {
      const courseName =
        consentMockUp.ConsentSuite.orgMgt.rootOrg.webLearnUnit.courses.cssOnlineCourseConsent.name
      form = consentMockUp.CreateConsentForms.auCssOnlineLearningConsentForm
      formName = form.name.new
      manageCourseConsent.setCourseName(courseName)
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Learning Admin not able to use deprecated form in predefined consent list', () => {
      Story.ticket('QA-480')
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDelete(formName)

      cy.logInTestCase('Create consent form')
      manageConsent.createForm(form)
      manageConsent.save()
      manageConsent.showEntry('75')

      cy.logInTestCase('Mark consent form as deprecate')
      manageConsent.markAsDeprecated(formName)

      cy.logInTestCase('Replace consent')
      manageCourseConsent.accessToManageConsent()
      manageCourseConsent.replaceConsent()

      cy.logInTestCase('Expect predefine form not available')
      manageCourseConsent.expectNotAvailablePredefinedForm(formName)
    })
  })
})
