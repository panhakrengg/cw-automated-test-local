import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseInstanceId
  let folderName
  const faker = new Faker()
  const resources = new LearnerResources()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/course-instances/learner-resources.yaml').then(
      (learnerResourceString) => {
        const learnerResource = YAML.parse(learnerResourceString)
        faker.setPathFixture(learnerResource.CourseData.tennisWarmUpGuide)
        courseId = faker.getUrlId()
        faker.setPathFixture(
          learnerResource.CourseData.tennisWarmUpGuide.courseInstances.bookedCourse
        )
        courseInstanceId = faker.getUrlId()
        folderName = learnerResource.CreateFolder.learnerResources.folders.week1.name
      }
    )
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin create folder in Learner Resources', () => {
      Story.ticket('QA-914')
      SignInAs.copAdmin()
      resources.visitLeanerResourceBy(courseId, courseInstanceId)
      resources.deleteResource(folderName)
      resources.createFolder(folderName)
      resources.expectNewFolderCreated(folderName)

      context('Reset data', () => {
        resources.deleteResource(folderName)
      })
    })
  })
})
