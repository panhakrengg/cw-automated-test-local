import Epic from '../../../../classes/Epic'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId = 0
  let courseName = ''
  let courseOverview = ''
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const lmsTrainingCop = new LmsTrainingCopBase()
  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getAcceptedForEveryone((course) => {
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
      courseOverview = course.courseOverview
    })
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  context(Story.learner, () => {
    it('Learner able to see unpublish booked course in My Learning, but not in Course Catalog', () => {
      Story.ticket('QA-581')
      learningCop.visitLearning()
      learningCop.expectCourseNotFoundCopLearning(courseName)
      learningCop.visitMyLearning()
      learningCop.expectCourseFoundInMyLearning(courseName, courseOverview)
      learningCop.expectViewCourseInMyCoursesPopup(courseName, courseOverview)
      learningCop.expectNoResultFoundForSearch(courseName)
      learningCop.expectedAccessDeniedFromCopLearning(courseId)
      courseDetail.expectedAccessDeniedFromCourseCatalog(courseId)
    })
  })
})
