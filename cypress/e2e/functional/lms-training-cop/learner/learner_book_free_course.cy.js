import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import Booking from '../../../../classes/course/Booking'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import InstanceDetails from '../../../../classes/lms/InstanceDetails'
import Learning from '../../../../classes/lms/Learning'
import WebNotification from '../../../../classes/notification/WebNotification'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let instance
  let courseId
  let courseName
  const learnerScreenName = 'au_copmember'
  const faker = new Faker()
  const webNotification = new WebNotification()
  const learning = new Learning()
  const booking = new Booking()
  const courseDetail = new CourseDetail()
  const instanceDetail = new InstanceDetails()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/book-course')
  const lmsTrainingCop = new LmsTrainingCopBase()
  before(() => {
    yamlHelper.read().then(({ CourseData, BookingCourse }) => {
      const course = CourseData.tennisByYourself
      courseName = course.name
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      instance = BookingCourse.freeCourse
      booking.setCourseId(courseId)
      booking.setDate(instance.date)
      booking.setDeliveryMethod(instance.deliveryMethod)
    })
  })
  context(Story.learner, () => {
    it('Learner book free course', () => {
      Story.ticket('QA-940')

      context('Prepare data', () => {
        lmsTrainingCop.login.toMyLearningPageAsLearner()
        learning.showItemPerPage(75)
        learning.viewMyCoursesByCourseName(courseName)
        learning.withdrawByDate(instance.date)
      })

      context('Learner book a course', () => {
        courseDetail.visitCourseDetail(courseId)
        booking.bookByDeliveryMethodAndDate(0)
        instanceDetail.clickOnBackLink()
        learning.showItemPerPage(75)
        learning.expectCourseHasButton(courseName, Field.START)
        learning.viewMyCoursesByCourseName(courseName)
        learning.expectToSeeBookedCourseHasButton(instance.date, Field.START)
        courseDetail.visitCourseDetail(courseId)
        booking.verifySlotAvailable(instance.slotAvailable)
      })

      context('Cop Admin verify the notification', () => {
        SignInAs.reSignInAsCopAdmin()
        instanceDetail._itcFetchCourseActivities.set()
        webNotification
          .getNotificationOfBookingACourse(learnerScreenName, courseName)
          .eq(0)
          .should('be.visible')
          .click()
        instanceDetail._itcFetchCourseActivities.wait()
        instanceDetail.verifyOverview(courseName, instance)
      })
    })
  })
})
