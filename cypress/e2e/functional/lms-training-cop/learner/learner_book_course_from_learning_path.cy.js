import Field from '../../../../classes/constants/Field'
import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Learning from '../../../../classes/lms/Learning'
import WebNotification from '../../../../classes/notification/WebNotification'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let instance
  let courseName
  let instanceDate
  let learningPath
  let learningPathId
  const faker = new Faker()
  const booking = new Booking()
  const learning = new Learning()
  const webNotification = new WebNotification()
  const learningPathDetail = new LearningPathDetail()
  const learnerScreenName = 'au_copmember'
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/book-course')
  before(() => {
    yamlHelper.read().then(({ BookingCourse, LearningPathData, CourseData }) => {
      instance = BookingCourse.freeCourseLP
      instanceDate = instance.date
      courseName = CourseData.practiceMorning.name
      learningPath = LearningPathData.firstClass
      faker.setPathFixture(learningPath)
      learningPathId = faker.getUrlId()
      booking.setDate(instanceDate)
      booking.setDeliveryMethod(instance.deliveryMethod)
    })
  })
  context(Story.learner, () => {
    it('Learner book course from learning path', () => {
      Story.ticket('QA-950')

      cy.logInTestCase('Prepare data')
      SignInAs.copMember()
      learning.visitLearningPage()
      learning.showItemPerPage(75)
      learning.viewMyCoursesByCourseName(courseName)
      learning.withdrawByDate(instanceDate)

      cy.logInTestCase('Learner booking a course from learning path')
      learningPathDetail.visitLearningPathDetail(learningPathId)
      learningPathDetail.clickOnCourseName(courseName)
      booking.bookByDeliveryMethodAndDate()
      cy.wait(2000)

      cy.logInTestCase('Verify booked course')
      learningPathDetail._verifyBookedCourseOverview(learningPath.name, courseName, instance)
      learningPathDetail._clickOnLpNameBreadcrumb()
      learningPathDetail._verifyBookedCourse(courseName)
      learning.visitLearningPage()
      learning.showItemPerPage(75)
      learning.expectCourseHasButton(courseName, Field.START)
      learning.viewMyCoursesByCourseName(courseName)
      learning.expectToSeeBookedCourseHasButton(instanceDate, Field.START)

      cy.logInTestCase('Cop admin verify notification')
      SignInAs.reSignInAsCopAdmin()
      webNotification
        .getNotificationOfBookingACourse(learnerScreenName, courseName)
        .eq(0)
        .then(($notification) => {
          expect($notification).to.be.visible
          webNotification.markAsRead($notification)
        })
    })
  })
})
