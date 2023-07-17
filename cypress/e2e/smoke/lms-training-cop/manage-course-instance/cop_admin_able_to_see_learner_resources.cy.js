import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseInstanceId
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
      }
    )
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin able to see Learner Resources', () => {
      Story.ticket('QA-1339')
      SignInAs.copAdmin()
      resources.visitLeanerResourceBy(courseId, courseInstanceId)
      resources.expectToSeeResourcesPage()
    })
  })
})
