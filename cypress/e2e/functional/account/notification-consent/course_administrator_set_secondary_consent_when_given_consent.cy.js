import Consent from '../../../../classes/account/consents/Consent'
import ConsentSettings from '../../../../classes/account/consents/ConsentSettings'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import ManageCopConsent from '../../../../classes/org-management/org-admin/ManageCopConsent'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, { retries: 1 }, () => {
  const signInLmsAs = new SignInLmsAs()
  const consentSettings = new ConsentSettings()
  const courseDetail = new CourseDetail()
  const manageCopConsent = new ManageCopConsent()
  const consent = new Consent()
  const COURSE_TITLE = 'Course consent course administrator opt out tracking functionality'

  context(Story.notificationsConsent, () => {
    let courseConsentAdminOptOut
    let courseConsentAdminOptOutCourseId
    let auOptOutCa

    before(() => {
      cy.stubUser(UserRole.LEARNER_USERS.AU_OPT_OUT_CA, 'stubUser', 1)
      cy.get('@stubUser').then((user) => {
        auOptOutCa = user
      })
      cy.stubCourse('account', 'courseConsentAdminOptOut')
      cy.get('@course').then((course) => {
        courseConsentAdminOptOut = course
        courseConsentAdminOptOutCourseId = course.id
      })
    })

    it('Course Administrator set secondary email consents managed when Learner gives consent', () => {
      Story.ticket('QA-1521')
      signInLmsAs.couMember_auOptOutMember()

      cy.logInTestCase('Revoke consent form')
      consentSettings.visit()
      consentSettings.accessConsentTab('Courses')
      cy.wrap(consentSettings.findConsentItemBy(COURSE_TITLE)).then(($isContain) => {
        if ($isContain) {
          consentSettings.getConsentItem(COURSE_TITLE)
          consentSettings.revokeConsent()
          consent.expectSendRevokeConsentEmail(
            `Revoked Consent in ${COURSE_TITLE}`,
            auOptOutCa.email
          )
        }
      })

      cy.logInTestCase('Learner accept consent form')
      courseDetail.visitCourseDetail(courseConsentAdminOptOutCourseId)
      courseDetail.clickButtonStartCourse()
      manageCopConsent.acceptConsent()
      consent.expectSendGivenConsentEmail(
        `Your Member Gave Consent to ${COURSE_TITLE}`,
        auOptOutCa.email
      )
      courseDetail.visitCourseDetail(courseConsentAdminOptOutCourseId)
    })
  })
})
