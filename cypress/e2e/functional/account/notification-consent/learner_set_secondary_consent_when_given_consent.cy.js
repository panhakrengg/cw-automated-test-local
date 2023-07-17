import Consent from '../../../../classes/account/consents/Consent'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.Account, () => {
  const accountYamlHelper = new YamlHelper('account')
  const orgUserYamlHelper = new YamlHelper('users-orgmgt')
  const faker = new Faker()
  const consent = new Consent()
  const signInLmsAs = new SignInLmsAs()
  const courseDetail = new CourseDetail()
  const manageCopConsent = new ManageCopConsent()
  const consentSettings = new ConsentSettings()

  context(Story.notificationsConsent, () => {
    let courseConsentAdminOptOut
    let courseConsentAdminOptOutCourseId
    let courseConsentAdminOptOutTitle
    let auOptOutLearner

    before(() => {
      orgUserYamlHelper
        .read()
        .its('Users.uat')
        .then((user) => {
          auOptOutLearner = user.auOptOutLearner
        })
      accountYamlHelper
        .read()
        .its('Courses')
        .then((courses) => {
          courseConsentAdminOptOut = courses.courseConsentAdminOptOut
          courseConsentAdminOptOutTitle = courseConsentAdminOptOut.title
          faker.setPathFixture(courseConsentAdminOptOut)
          courseConsentAdminOptOutCourseId = faker.getUrlId()
        })
    })

    it('Learner set secondary email on consents given then give consent on a course', () => {
      Story.ticket('QA-1523')
      signInLmsAs.couMember_auOptOutLearner()

      cy.logInTestCase('Revoke consent form')
      consentSettings.visit()
      consentSettings.accessConsentTab('Courses')
      cy.wrap(consentSettings.findConsentItemBy(courseConsentAdminOptOutTitle)).then(
        ($isContain) => {
          if ($isContain) {
            consentSettings.getConsentItem(courseConsentAdminOptOutTitle)
            consentSettings.revokeConsent()
          }
        }
      )

      cy.logInTestCase('Learner accept consent form')
      courseDetail.visitCourseDetail(courseConsentAdminOptOutCourseId)
      courseDetail.clickButtonStartCourse()
      manageCopConsent.acceptConsent()
      consent.expectSendGivenConsentEmail(
        `You Gave Consent to ${courseConsentAdminOptOutTitle}`,
        auOptOutLearner.secondaryEmail
      )
      consent.expectedNotSendGivenConsentEmail(
        `You Gave Consent to ${courseConsentAdminOptOutTitle}`,
        auOptOutLearner.email
      )
    })
  })
})
