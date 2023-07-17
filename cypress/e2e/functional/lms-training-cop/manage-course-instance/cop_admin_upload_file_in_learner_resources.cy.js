import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseInstanceId
  let folderName
  let uploadFiles
  const faker = new Faker()
  const resources = new LearnerResources()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/learner-resources')
  before(() => {
    yamlHelper.read().then(({ CourseData, UploadFiles }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      faker.setPathFixture(CourseData.tennisWarmUpGuide.courseInstances.bookedCourse)
      courseInstanceId = faker.getUrlId()
      const meetTraineeFolder = UploadFiles.learnerResources.folders.meetTrainee
      uploadFiles = meetTraineeFolder.files
      folderName = meetTraineeFolder.name
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin upload files in Learner Resources', () => {
      Story.ticket('QA-915')

      cy.logInTestCase('Login as Cop Admin then navigate to learner resource')
      SignInAs.copAdmin()
      resources.visitLeanerResourceBy(courseId, courseInstanceId)

      cy.logInTestCase('Reset data')
      resources.accessToFolder(folderName)
      resources.deleteFiles(uploadFiles)

      cy.logInTestCase('Upload files')
      resources.upload(uploadFiles)

      cy.logInTestCase('Expect to see uploaded files')
      resources.expectNewFileUploaded(uploadFiles)
    })
  })
})
