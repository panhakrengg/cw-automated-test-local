import Epic from '../../../../classes/Epic'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { tags: '@skipPrd' }, () => {
  const signInLmsAs = new SignInLmsAs()
  const yamlHelper = new YamlHelper('lms/learning-path/sample-learning-path')
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const learningPathDetail = new LearningPathDetail()
  let learningPathName
  let courseName

  before(() => {
    yamlHelper
      .read()
      .its('LearningPathData.noBookAndCompleteCourse')
      .then((data) => {
        learningPathName = data.name
      })
    yamlHelper
      .read()
      .its('CourseData.publishNoBook')
      .then((data) => {
        courseName = data.name
      })
    signInLmsAs.istMember_Delphia()
  })

  context(Story.learningPaths, () => {
    it('Learner click view course from learning path still in progress', () => {
      Story.ticket('QA-1505')
      learning.visitLearningPage()
      learningPathDetail.visitLearningPathCourse(learningPathName, courseName)
      learning.expectChooseBookingOptionSection()
      courseDetail.expectCourseDetailSectionIsValid()
      learningPathDetail._clickOnLpNameBreadcrumb()
      learningPathDetail._expectBackToLearningPath(learningPathName)
      learningPathDetail.expectNoBreadcrumbExists()
    })
  })
})
