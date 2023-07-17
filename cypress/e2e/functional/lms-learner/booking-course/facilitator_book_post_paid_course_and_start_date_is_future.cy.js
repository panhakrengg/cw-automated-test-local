import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import InstanceDetails from '../../../../classes/lms/InstanceDetails'
import Learning from '../../../../classes/lms/Learning'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import ManageCourseConsent from '../../../../classes/org-management/org-admin/ManageCourseConsent'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'
import Field from '../../../../classes/constants/Field'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const signInLmsAs = new SignInLmsAs()
  const learning = new Learning()
  const booking = new Booking()
  const courseDetail = new CourseDetail()
  const instanceDetail = new InstanceDetails()
  const faker = new Faker()
  const manageCourse = new ManageCourses()
  const manageCourseConsent = new ManageCourseConsent()

  context(Story.bookingCourse, () => {
    let instance
    let courseId
    let instanceId
    let courseName
    let userEmail

    before(() => {
      new YamlHelper('lms/course-instances/book-course').read().then(({ CourseData }) => {
        const course = CourseData.booking
        courseName = course.name
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        instance = course.postPaidCourse
        faker.setPathFixture(instance)
        instanceId = faker.getUrlId()
        booking.setCourseId(courseId)
        booking.setDate(instance.date)
        booking.setDeliveryMethod(instance.deliveryMethod)
      })

      new YamlHelper('users-orgmgt')
        .read()
        .its('Users.uat')
        .then((users) => {
          userEmail = users.auLnIstFaci_Britney.email
        })
    })

    after(() => {
      ReportDefect.markCwDefect('Slow to book a course instance')
    })

    it('Instance Facilitator(admin) book Postpaid course and Start Date is Future Date', () => {
      Story.ticket('QA-1515', ['CW-16098'])

      context('Prepare data', () => {
        signInLmsAs.istFaci_Britney()
        manageCourseConsent.accessToCiManagePeopleBy(instanceId, courseId)
        manageCourseConsent.removeCourseInstanceMember(userEmail)
      })

      context('Learner book a course', () => {
        courseDetail.visitCourseDetail(courseId)
        booking.bookByDeliveryMethodAndDate()
        instanceDetail.clickOnBackLink()
        learning.expectCourseHasButton(courseName, Field.START)
        learning.viewMyCoursesByCourseName(courseName)
        learning.expectToSeeBookedCourseHasButton(instance.date, Field.START)
      })

      context('Check course status on admin site', () => {
        manageCourse.accessCourseInstanceBy(courseId, instanceId, 'People')
        manageCourse.expectedUserContainStatus(userEmail, 'Booked')
      })
    })
  })
})
