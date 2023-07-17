import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.OrgAdmin, () => {
  context(Story.orgAdminManageConsents, () => {
    const manageConsent = new ManageConsent()

    let manageCourseConsent
    let instanceId
    let courseId
    let toCreateConsentForm
    let oldConsentForm
    let newConsentForm

    const replaceConsentForm = (consentForm, courseId) => {
      manageCourseConsent.accessToManageConsentBy(courseId)
      manageCourseConsent.replaceConsent()
      manageCourseConsent.selectPredefinedConsentForm(consentForm)
    }

    before(() => {
      cy.stubCourse('validation/courses', 'courseConsentHasABookedMember')
      cy.get('@course').then((course) => {
        courseId = course.id
        manageCourseConsent = new ManageCourseConsent(course.title)
      })
      cy.stubCourseInstance(
        'validation/courses',
        'courseConsentHasABookedMember',
        'socialAndBehavioralSciences'
      )
      cy.get('@courseInstance').then((courseInstance) => {
        instanceId = courseInstance.id
      })

      new YamlHelper('consent')
        .read()
        .its('CreateConsentForms.auCoursePolicyAndPrivacyForBookingCourseAddress')
        .then((consentFormData) => {
          toCreateConsentForm = consentFormData
          oldConsentForm = consentFormData['name']['old']
          newConsentForm = consentFormData['name']['new']
        })
    })

    it('Org Admin create a consent form type as Join for course and existing must agree to change', () => {
      Story.ticket('QA-412')

      cy.logInTestCase('clean up data')
      SignInAs.orgAdmin()
      replaceConsentForm(oldConsentForm, courseId)
      manageConsent.cleanUpConsentFormByDeprecatedAndDelete(newConsentForm)

      cy.logInTestCase('create consent form')
      manageConsent.accessToManageOrgConsent()
      manageConsent.createForm(toCreateConsentForm)
      manageConsent.save()

      cy.logInTestCase('replace new consent form')
      replaceConsentForm(newConsentForm, courseId)

      cy.logInTestCase('expect learner see consent popup and accept')
      manageCourseConsent.expectLearnerSeeConsentPopupAndAccept(
        instanceId,
        UserRole.INSTRUCTION_SESSION.MEMBERS,
        true
      )

      cy.logInTestCase('clean up data')
      SignInAs.orgAdmin()
      replaceConsentForm(oldConsentForm, courseId)
      manageConsent.cleanUpConsentFormByDeprecatedAndDelete(newConsentForm)
    })
  })
})
