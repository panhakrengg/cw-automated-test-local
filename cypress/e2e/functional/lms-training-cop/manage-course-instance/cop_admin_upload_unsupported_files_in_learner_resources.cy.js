import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let files
  let courseId
  let courseInstanceId
  const faker = new Faker()
  const resources = new LearnerResources()
  const unSupportedFiles = new YamlHelper('sample-unsupport-files')
  const learnerResource = new YamlHelper('lms-training-cop/course-instances/learner-resources')
  before(() => {
    unSupportedFiles.read().then(({ UnsupportedFiles }) => {
      files = UnsupportedFiles
    })
    learnerResource.read().then(({ CourseData }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      faker.setPathFixture(CourseData.tennisWarmUpGuide.courseInstances.bookedCourse)
      courseInstanceId = faker.getUrlId()
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin upload unsupported files in Learner Resources', () => {
      Story.ticket('QA-1345')
      SignInAs.copAdmin()
      resources.visitLeanerResourceBy(courseId, courseInstanceId)
      resources.verifyUploadUnSupportFiles(files)
      resources.expectResourcesNotExist(files)
    })
  })
})
