import Notifications from '../../../../classes/account/Notifications'
import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import NotificationsConstants from '../../../../classes/constants/my-account/NotificationsConstants'
import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, () => {
  const booking = new Booking()
  const signInLmsAs = new SignInLmsAs()
  const notifications = new Notifications()
  const FACILITATOR_NOTIFICATION = NotificationsConstants.FACILITATOR_NOTIFICATION

  context(Story.notificationsLearning, () => {
    let optOutLearnerNotificationCourse
    let optOutLearnerNotificationCourseId
    let optOutLearnerNotificationVirtualClassroomId
    let virtualClassroomScheduleDate
    let auAcFuncMember
    before(() => {
      cy.stubUser(UserRole.ACTIVITY_LOG.AU_AC_FUNC_MEMBER)
      cy.get('@stubUser').then((user) => {
        auAcFuncMember = user
      })
      cy.stubCourse('account', 'optOutLearnerNotification')
      cy.get('@course').then((course) => {
        optOutLearnerNotificationCourse = course
        optOutLearnerNotificationCourseId = course.id
      })
      cy.stubCourseInstance('account', 'optOutLearnerNotification', 'virtualClassroom')
      cy.get('@courseInstance').then((course) => {
        virtualClassroomScheduleDate = course.schedule
        optOutLearnerNotificationVirtualClassroomId = course.id
      })
    })

    after(() => {
      ReportDefect.markCwDefect('Book course instance not success CW-15897')
    })

    it('Course Leader opt-out learner withdraw a course', () => {
      Story.ticket('QA-1302', ['CW-15897'])

      booking.setCourseId(optOutLearnerNotificationCourseId)
      booking.setDeliveryMethod(DeliveryMethod.VIRTUAL_CLASSROOM)
      cy.logInTestCase('Reset data')
      signInLmsAs.couLead_AueTanya()
      notifications.removeMemberFromInstanceAndOptInNotificationBy(
        optOutLearnerNotificationVirtualClassroomId,
        optOutLearnerNotificationCourseId,
        auAcFuncMember.email,
        FACILITATOR_NOTIFICATION,
        OrgConst.NAME
      )

      cy.logInTestCase('Course Leader opt out learner notifications')
      notifications.optOutNotificationItemBy(FACILITATOR_NOTIFICATION)

      cy.logInTestCase('Learner books course')
      signInLmsAs.ctgMember_FuncMember()

      booking.bookCourseInstanceWithoutActivity()

      cy.logInTestCase('Withdraw course instance')
      notifications.withDrawCourseInstanceBy(
        optOutLearnerNotificationCourse.title,
        virtualClassroomScheduleDate,
        DeliveryMethod.VIRTUAL_CLASSROOM
      )

      cy.logInTestCase('Verify course leader not receive notification')
      signInLmsAs.couLead_Func()
      notifications.verifyNotReceiveWithDrawCourseWebNotificationBy(
        auAcFuncMember.screenName,
        optOutLearnerNotificationCourse.title
      )

      cy.logInTestCase('Reset data')
      notifications.optInNotificationBy(FACILITATOR_NOTIFICATION)
      signInLmsAs.ctgMember_FuncMember()
      booking.bookCourseInstance()
    })
  })
})
