import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Consent from '../../../../classes/account/consents/Consent'
import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import Booking from '../../../../classes/course/Booking'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.OrgAdmin, () => {
  let courseId
  let courseInstanceId
  let memberEmail
  let memberScreenName
  let consentFormName
  const booking = new Booking()
  const faker = new Faker()
  const consent = new Consent()
  const manageCourseConsent = new ManageCourseConsent()

  before(() => {
    cy.readFile('cypress/fixtures/users-orgmgt.yaml').then((OrgUsersString) => {
      const orgUser = YAML.parse(OrgUsersString).Users.uat.memberRootOrg
      memberEmail = orgUser.email
      memberScreenName = orgUser.screenName
    })
    cy.readFile('cypress/fixtures/consent.yaml').then((consentString) => {
      const consentForm =
        YAML.parse(consentString).ExistingConsentForms.courseCopyRightCaseStudiesTestAutomation
      const course = consentForm.inUse.courses.caseStudiesOfSoftwareTestAutomation
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      faker.setPathFixture(course.courseInstances)
      consentFormName = consentForm.name
      courseInstanceId = faker.getUrlId()
      booking.setCourseId(courseId)
      booking.setDeliveryMethod(DeliveryMethod.PHYSICAL_CLASSROOM)
    })
  })

  context(Story.orgAdminManageConsents, () => {
    it('Org Admin deprecate a form in use by Course and still be in used for course member already book', () => {
      SignInAs.learningAdmin()
      manageCourseConsent.accessToCiManagePeopleBy(courseInstanceId, courseId, OrgConst.NAME)
      manageCourseConsent.removeCourseInstanceMember(memberEmail)
      manageCourseConsent.addMemberToCourseInstance(memberScreenName)

      SignInAs.reSignInAsRootOrgMember()
      booking.accessToCourseDetail()
      booking.start()
      consent.expectToSeeConsentPopup(consentFormName)

      SignInAs.reSignInAsLearningAdmin()
      manageCourseConsent.accessToCiManagePeopleBy(courseInstanceId, courseId, OrgConst.NAME)
      manageCourseConsent.removeCourseInstanceMember(memberEmail)
    })
  })
})
