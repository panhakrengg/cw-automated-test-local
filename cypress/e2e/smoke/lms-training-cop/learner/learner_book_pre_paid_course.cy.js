import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  const faker = new Faker()
  const booking = new Booking()
  const courseDetail = new CourseDetail()
  const lmsTrainingCop = new LmsTrainingCopBase()

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getTennisByYourself((course) => {
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
    })
    lmsTrainingCop.stub.bookCourse.getPrePaidCourse((courseInstance) => {
      booking.setDate(courseInstance.date)
      booking.setDeliveryMethod(courseInstance.deliveryMethod)
    })
  })
  context(Story.learner, () => {
    it('Learner book pre-paid course', () => {
      Story.ticket('QA-942')
      SignInAs.copMember()
      courseDetail.visitCourseDetail(courseId)
      booking.getInstanceByDeliveryMethodAndDate().click()
      booking.clickOnBookThisCourseThenDirectToPayment()
      booking.expectPlaceOrderButtonDisabled()
      booking.selectCard('Visa')
      booking.enterPaymentInfo()
      booking.expectPlaceOrderButtonEnabled()
      booking.selectCard('Coupon')
      booking.expectToSeeInputCouponField()
      booking.clickBackToCourse()
      courseDetail.expectToSeeCourseDetailPage()
    })
  })
})
