import ActivityLogs from '../../../../classes/account/ActivityLogs'
import AccountUserStub from '../../../../classes/account/stub/AccountUserStub'
import ActivityCategories from '../../../../classes/constants/ActivityCategories'
import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import Story from '../../../../classes/Story'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

const TRAINING_AND_DEVELOPMENT = ActivityCategories.TRAINING_AND_DEVELOPMENT

describe(Epic.Account, { retries: 1 }, () => {
  const booking = new Booking()
  const activityLogs = new ActivityLogs()
  const manageCourseConsent = new ManageCourseConsent()

  context(Story.activityTrainingAndDevelopment, () => {
    let auAcFuncMemberName
    let auAcFuncMemberEmail
    let ccFuncTrackingActivityLog
    let ccFuncTrackingCId
    let ccFuncTrackingCIId

    before(() => {
      cy.stubUser(UserRole.ACTIVITY_LOG.AU_AC_FUNC_MEMBER)
      cy.get('@stubUser').then((user) => {
        auAcFuncMemberName = user.familyName + ' ' + user.givenName
        auAcFuncMemberEmail = user.email
      })

      cy.stubCourse('account', 'ccFuncTrackingActivityLog')
      cy.get('@course').then((course) => {
        ccFuncTrackingActivityLog = course
        ccFuncTrackingCId = course.id
      })
      cy.stubCourseInstance('account', 'ccFuncTrackingActivityLog', 'virtualClass')
      cy.get('@courseInstance').then((course) => {
        ccFuncTrackingCIId = course.id
      })
    })

    it('Learner book a course then logs activity - Training & Development', () => {
      Story.ticket('QA-1385')

      booking.setCourseId(ccFuncTrackingCId)
      booking.setDeliveryMethod(DeliveryMethod.VIRTUAL_CLASSROOM)

      cy.logInTestCase('Reset data')
      AccountUserStub.signInAsAuAcFunc()
      manageCourseConsent.accessToCiManagePeopleBy(
        ccFuncTrackingCIId,
        ccFuncTrackingCId,
        OrgConst.NAME
      )
      manageCourseConsent.removeCourseInstanceMember(auAcFuncMemberEmail)

      cy.logInTestCase(`Booking course instance`)
      AccountUserStub.signInAsAuAcFuncMember()
      booking.bookCourseInstanceWithoutActivity()

      cy.logInTestCase('Navigate to training and development activity log')
      activityLogs.accessActivityLog()
      activityLogs.clickFilterActivityBy(TRAINING_AND_DEVELOPMENT)

      cy.logInTestCase('Verify book course instance activity log')
      activityLogs.containLogBookedTheCourse(
        auAcFuncMemberName,
        ccFuncTrackingActivityLog.title,
        activityLogs.getCurrentDate()
      )
    })
  })
})
