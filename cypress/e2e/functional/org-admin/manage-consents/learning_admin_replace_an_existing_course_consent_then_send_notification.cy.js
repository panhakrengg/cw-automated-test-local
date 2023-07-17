import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import EmailOrgManagement from '../../../../classes/notification/email/EmailOrgManagement'
import ManageConsent from '../../../../classes/org-management/org-admin/ManageConsent'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import ManageConsentHelper from '../../../../classes/org-management/org-admin/util/ManageConsentHelper'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, { retries: 1 }, () => {
  context(Story.orgAdminManageConsents, () => {
    const manageConsent = new ManageConsent()
    const manageCourseConsent = new ManageCourseConsent()

    let newConsentForm, oldConsentForm, courseId, courseTitle
    let toCreateNewConsentForm
    let toRemoveConsentForm

    let auCourseOrgLeader
    let auCourseOrgLeadFaci
    let auCourseOrgFaci
    let auCourseOrgAdmin
    let auLearnMgtAdmin

    const verifyReplaceConsentEmail = (recipient) => {
      cy.wrap(null).then(() => {
        manageCourseConsent.verifyReplaceConsentEmail(
          newConsentForm,
          oldConsentForm,
          {
            recipient,
            user: auLearnMgtAdmin,
            courseTitle,
            courseId,
            orgName: EmailOrgManagement.ORGANIZATION_NAME,
          },
          recipient['givenName'] === auLearnMgtAdmin['givenName']
        )
      })
    }

    const learningAdminReplaceConsentForm = (consentForm, courseId) => {
      SignInAs.reSignInAsLearningAdmin()
      new ManageConsentHelper().replaceCourseConsentForm(courseId, consentForm, newConsentForm)
    }

    beforeEach(() => {
      cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((usersString) => {
        const { uat } = YAML.parse(usersString).Users
        auCourseOrgLeader = uat['courseOrgLeader']
        auCourseOrgLeadFaci = uat['courseOrgLeadFaci']
        auCourseOrgFaci = uat['courseOrgFaci']
        auCourseOrgAdmin = uat['courseOrgAdmin']
        auLearnMgtAdmin = uat['learnMgtAdmin']
      })
      cy.readFile('cypress/fixtures/validation/courses.yaml').then((coursesString) => {
        const { javaOopConcept } = YAML.parse(coursesString)['Courses']
        courseId = new Faker(javaOopConcept).getUrlId()
        courseTitle = javaOopConcept['title']
      })
      cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
        const consents = YAML.parse(consentString)
        newConsentForm = consents['CreateConsentForms']['auCourseConsentTitle']
        oldConsentForm = consents['ExistingConsentForms']['consentReplaceStudentPrivacy2010']
        toCreateNewConsentForm = newConsentForm['name']['new']
        toRemoveConsentForm = newConsentForm['name']['old']
      })
    })

    it('Learning Admin replace an existing course consent then send notification', () => {
      Story.ticket('QA-409')

      cy.logInTestCase('Reset data')
      learningAdminReplaceConsentForm(toRemoveConsentForm, courseId)
      SignInAs.orgAdmin()
      manageConsent.cleanUpConsentFormByDeprecatedAndDelete(toCreateNewConsentForm)

      cy.logInTestCase('Create new consent form')
      manageConsent.createForm(newConsentForm)
      manageConsent.save()

      cy.logInTestCase('Replace consent form')
      learningAdminReplaceConsentForm(toCreateNewConsentForm, courseId)

      cy.logInTestCase('Verify replace consent emails')
      verifyReplaceConsentEmail(auCourseOrgLeader)
      verifyReplaceConsentEmail(auCourseOrgLeadFaci)
      verifyReplaceConsentEmail(auCourseOrgFaci)
      verifyReplaceConsentEmail(auCourseOrgAdmin)
      verifyReplaceConsentEmail(auLearnMgtAdmin)
    })
  })
})
