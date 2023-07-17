import Notifications from '../../../../classes/account/Notifications'
import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import NotificationsConstants from '../../../../classes/constants/my-account/NotificationsConstants'
import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import { OrgConst } from '../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import UserRole from '../../../../classes/utilities/user-role/UserRole'

describe(Epic.Account, { retries: 1 }, () => {
  const signInLmsAs = new SignInLmsAs()
  const notifications = new Notifications()
  const booking = new Booking()
  const FACILITATOR_NOTIFICATION = NotificationsConstants.FACILITATOR_NOTIFICATION

  context(Story.notificationsLearning, () => {
    let optOutLearnerNotificationCourse
    let optOutLearnerNotificationCourseId
    let optOutLearnerNotificationSelfStudyId
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
      cy.stubCourseInstance('account', 'optOutLearnerNotification', 'selfStudy')
      cy.get('@courseInstance').then((course) => {
        optOutLearnerNotificationSelfStudyId = course.id
      })
    })

    it('Learner opt-out book course', () => {
      Story.ticket('QA-1301')

      booking.setCourseId(optOutLearnerNotificationCourseId)
      booking.setDeliveryMethod(DeliveryMethod.SELF_STUDY)

      context('Reset data', () => {
        signInLmsAs.couLead_Func()
        notifications.removeMemberFromInstanceAndOptInNotificationBy(
          optOutLearnerNotificationSelfStudyId,
          optOutLearnerNotificationCourseId,
          auAcFuncMember.email,
          FACILITATOR_NOTIFICATION,
          OrgConst.NAME
        )
        notifications.removeTheLastNotificationWith('booked the')
      })

      context('Course Leader opt out learner notifications', () => {
        notifications.optOutNotificationItemBy(FACILITATOR_NOTIFICATION)
      })

      context('Learner books course', () => {
        signInLmsAs.ctgMember_FuncMember()
        booking.bookCourseInstanceWithoutActivity()
      })

      context('Verify course leader not receive notification', () => {
        signInLmsAs.couLead_Func()
        notifications.verifyNotReceiveBookCourseWebNotificationBy(
          auAcFuncMember.screenName,
          optOutLearnerNotificationCourse.title
        )
      })

      context('Reset data', () => {
        notifications.removeMemberFromInstanceAndOptInNotificationBy(
          optOutLearnerNotificationSelfStudyId,
          optOutLearnerNotificationCourseId,
          auAcFuncMember.email,
          FACILITATOR_NOTIFICATION,
          OrgConst.NAME
        )
      })
    })
  })
})
