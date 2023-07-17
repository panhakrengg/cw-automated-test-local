import Consent from '../../../../classes/account/consents/Consent'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const yamlHelper = new YamlHelper('users-orgmgt')
  const accountYamlHelper = new YamlHelper('account')
  const signInLmsAs = new SignInLmsAs()
  const consentSettings = new ConsentSettings()
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const manageCopConsent = new ManageCopConsent()
  const consent = new Consent()

  context(Story.notificationsConsent, () => {
    let courseConsentOptOutNotification
    let courseConsentOptOutNotificationCourseId
    let courseConsentOptOutNotificationSelfStudyId
    let auOptOutOwnerUser
    let auOptOutMemberUser

    before(() => {
      yamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          auOptOutOwnerUser = user.auOptOutOwner
          auOptOutMemberUser = user.auOptOutMember
        })
      accountYamlHelper
        .read()
        .its('Courses')
        .then((courses) => {
          courseConsentOptOutNotification = courses.courseConsentOptOutNotification

          faker.setPathFixture(courseConsentOptOutNotification)
          courseConsentOptOutNotificationCourseId = faker.getUrlId()

          faker.setPathFixture(courseConsentOptOutNotification.courseInstances.selfStudy)
          courseConsentOptOutNotificationSelfStudyId = faker.getUrlId()
        })
    })

    after(() => {
      ReportDefect.markAsUATCwDefect('After enable consent still not show for learner')
    })

    it('Learning Admin opt out consents given when Learner given consent', () => {
      Story.ticket('QA-1519')
      signInLmsAs.couMember_auOptOutMember()

      cy.logInTestCase('Revoke consent form')
      consentSettings.visit()
      consentSettings.accessConsentTab('Courses')
      cy.wrap(consentSettings.findConsentItemBy(courseConsentOptOutNotification.title)).then(
        ($isContain) => {
          if ($isContain) {
            consentSettings.getConsentItem(courseConsentOptOutNotification.title)
            consentSettings.revokeConsent()
          }
        }
      )
      cy.logInTestCase('Learner accept consent form')
      courseDetail.visitCourseDetail(courseConsentOptOutNotificationCourseId)
      courseDetail.clickButtonStartCourse()
      manageCopConsent.acceptConsent()

      cy.logInTestCase('Verify not send email')
      consent.expectedNotSendGivenConsentEmail(
        `Your Member Gave Consent to ${courseConsentOptOutNotification.title}`,
        auOptOutOwnerUser.email
      )
      consent.expectedNotSendGivenConsentEmail(
        `You Gave Consent to ${courseConsentOptOutNotification.title}`,
        auOptOutMemberUser.email
      )
    })
  })
})
