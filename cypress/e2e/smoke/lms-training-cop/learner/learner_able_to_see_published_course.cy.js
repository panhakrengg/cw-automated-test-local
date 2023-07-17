import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Learning from '../../../../classes/lms/Learning'
import LmsTrainingCopMock from '../../../../classes/lms/LmsTrainingCopMock'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId = 0
  let courseInfo = {}
  let activityPhysicalClass = {}
  let activityVirtualClass = {}
  let instanceTitle

  const faker = new Faker()
  const learningCop = new LearningCoP()
  const courseDetail = new CourseDetail()
  const myLearning = new Learning()
  const lmsTCoPMock = new LmsTrainingCopMock()
  const yamlHelper = new YamlHelper('lms-training-cop/publish-unpublish-course')
  const activitiesYamlHelper = new YamlHelper('lms/course-activities/sample-activities')

  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      courseInfo = CourseData.tennisByYourself
      faker.setPathFixture(courseInfo)
      courseId = faker.getUrlId()
      instanceTitle = courseInfo.courseInstances.publishedNotBook.title
    })
    activitiesYamlHelper.read().then(({ SampleActivities }) => {
      activityPhysicalClass = SampleActivities.physicalClassChildren
      activityVirtualClass = SampleActivities.virtualTalking
    })
    lmsTCoPMock.setLearnerLearnTennisUrl(learningCop)
  })

  context(Story.learner, () => {
    it('Learner able to see publish course in Learning and Course Catalog', () => {
      Story.ticket('QA-1027')

      SignInAs.copMember(learningCop.getTrainingCopUrl())
      describe('Published course in CoP Learning', () => {
        learningCop.visitLearning()
        cy.waitLoadingOverlayNotExist()
        learningCop.expectToSeePublishedCourseAttributes(courseInfo)
      })

      describe('Published course in Course Catalog', () => {
        learningCop.visitMyLearning()
        myLearning.expectToSeeCourseAfterSearchInMyLearning(courseInfo, Field.VIEW, false, true)
      })

      describe('Course detail under Learning of CoP tab', () => {
        learningCop.expectCourseDetailInCopLearning(
          courseId,
          courseInfo,
          activityPhysicalClass,
          activityVirtualClass
        )
      })
      describe('Course detail under Learning in Course Catalog', () => {
        courseDetail.expectCourseDetailInCourseCatalog(
          courseId,
          courseInfo,
          activityPhysicalClass,
          activityVirtualClass,
          1
        )
      })
    })
  })
})
