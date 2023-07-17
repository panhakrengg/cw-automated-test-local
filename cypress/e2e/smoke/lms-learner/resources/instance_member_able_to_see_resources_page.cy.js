import Epic from '../../../../classes/Epic'
import CourseDetailResource from '../../../../classes/lms-training-cop/CourseDetailResource'
import Learning from '../../../../classes/lms/Learning'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, () => {
  const signInLmsAs = new SignInLmsAs()
  const faker = new Faker()
  const learning = new Learning()
  const courseDetailResource = new CourseDetailResource()
  let courseInstanceId = 0
  let instanceDate = ''

  before(() => {
    new YamlHelper('lms/sample-lms')
      .read()
      .its('CourseData.resourcesNotesDiscussion.resourceInstance')
      .then((resourceInstance) => {
        faker.setPathFixture(resourceInstance)
        courseInstanceId = faker.getUrlId()
        instanceDate = resourceInstance.date
      })
    signInLmsAs.istMember_Mallory()
  })

  context(Story.resources, () => {
    it('Instance Member able to see Resources page', () => {
      Story.ticket('QA-1506')
      learning.visitLearningPage()
      cy.selectItemPerPage(75)
      learning.visitCourseInstanceByClickingThreeDots(
        'Resources, Notes, Discussion',
        courseInstanceId,
        instanceDate
      )
      learning.visitCourseInstanceResourcesTab()
      courseDetailResource.expectToSeeCourseDetailResourcePage()
    })
  })
})
