import DeliveryMethod from '../../../../classes/constants/course/DeliveryMethod'
import Booking from '../../../../classes/course/Booking'
import Epic from '../../../../classes/Epic'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const faker = new Faker()
  const signInLmsAs = new SignInLmsAs()
  const copManageInstance = new CopManageInstance()
  const booking = new Booking()

  context(Story.courseCatalog, () => {
    let course
    let courseTitle
    let courseId
    let instance
    let activityPhysicalClass
    let activityVirtualClass

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData, BookCourses }) => {
        course = CourseData.restApi
        courseTitle = course.name
        instance = BookCourses.notBook
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        copManageInstance.setInstance()
        booking.setDeliveryMethod(DeliveryMethod.BLENDED_LEARNING)
        const activities = instance.activities
        activityPhysicalClass = activities.physicalClassChildren
        activityVirtualClass = activities.virtualTalking
      })
    })
    it('Category Member able to see publish course detail in Course Catalog', () => {
      Story.ticket('QA-1169')
      context('Go to course detail', () => {
        signInLmsAs.ctgMember_Quentin()
        learning.visitLearningPage()
        learning.searchCourse(courseTitle)
        learning.clickCourseBy(courseTitle)
      })

      context('Expected result', () => {
        courseDetail.assertContainHaveQuestionButton()
        courseDetail.initInstanceCardByDate(instance.date)
        courseDetail.expectBookButtonIsEnabled()
        courseDetail.expectCourseDetailInCourseCatalog(
          courseId,
          course,
          activityPhysicalClass,
          activityVirtualClass,
          false
        )
      })
    })
  })
})
