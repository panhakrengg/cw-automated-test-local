import Epic from '../../../../classes/Epic'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId = 0
  let courseName = ''
  const faker = new Faker()
  const courseDetail = new CourseDetail()
  const learningCop = new LearningCoP()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const yamlHelper = new YamlHelper('lms-training-cop/publish-unpublish-course')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      const course = CourseData.practiceMorning
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
    })
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
    SignInAs.cwNormalUser()
  })

  context(Story.learner, () => {
    it('Non-cop member not able to search and access to course of training cop', () => {
      Story.ticket('QA-1168', ['CW-16516'])
      learningCop.expectNoResultFoundForSearch(courseName)
      learningCop.expectedPageNotFoundOfCopLearning(courseId)
      courseDetail.expectedAccessDeniedFromCourseCatalog(courseId)
    })

    after(() => {
      ReportDefect.markCwDefect()
    })
  })
})
