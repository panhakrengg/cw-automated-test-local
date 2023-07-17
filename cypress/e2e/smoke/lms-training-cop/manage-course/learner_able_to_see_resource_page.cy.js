import Epic from '../../../../classes/Epic'
import CourseDetailResource from '../../../../classes/lms-training-cop/CourseDetailResource'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseInstanceId
  let faker = new Faker()
  const courseDetailResource = new CourseDetailResource()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/course-instances/learner-resources.yaml').then(
      (learnerResourceString) => {
        const learnerResource = YAML.parse(learnerResourceString)
        faker.setPathFixture(
          learnerResource.CourseData.tennisWarmUpGuide.courseInstances.bookedCourse
        )
        courseInstanceId = faker.getUrlId()
      }
    )
  })
  context(Story.learner, () => {
    it('Learner able to see Resources page', () => {
      Story.ticket('QA-1347')
      SignInAs.copMember()
      courseDetailResource.visitCourseDetailResourceBy(courseInstanceId)
      courseDetailResource.expectToSeeCourseDetailResourcePage()
    })
  })
})
