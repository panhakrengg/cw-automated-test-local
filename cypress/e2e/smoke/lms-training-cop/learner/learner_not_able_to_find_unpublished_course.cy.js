import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId = 0
  let courseName = 0
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const yamlHelper = new YamlHelper('lms-training-cop/publish-unpublish-course')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      const course = CourseData.planNextCourse
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
    })

    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.copMember(learningCop.getTrainingCopUrl())
  })

  context(Story.learner, () => {
    it('Learner not able to find unpublish course', () => {
      Story.ticket('QA-776')
      learningCop.visitLearning()
      learningCop.visitMyLearning()
      learningCop.expectNotAbleToFindUnpublishedCourse(courseName)
      learningCop.expectedAccessDeniedFromCopLearning(courseId)
      courseDetail.expectedAccessDeniedFromCourseCatalog(courseId)
    })
  })
})
