import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInAsLms = new SignInLmsAs()
  const faker = new Faker()
  const booking = new Booking()
  const courseDetail = new CourseDetail()

  context(Story.bookingCourse, () => {
    let courseId

    before(() => {
      new YamlHelper('lms/course-instances/book-course').read().then(({ CourseData }) => {
        const course = CourseData.booking
        const instance = course.prePaidCourse
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        booking.setDate(instance.endDate)
        booking.setDeliveryMethod(instance.deliveryMethod)
      })
    })

    it('Course Member able to see payment page when book pre-paid course', () => {
      Story.ticket('QA-1745')
      signInAsLms.couMember_Litzy()
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
