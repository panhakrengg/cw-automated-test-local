import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, { retries: 1 },() => {
  let courseId
  let folderName
  const faker = new Faker()
  const resources = new FacilitatorResources()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/courses/facilitator-resources.yaml').then(
      (facilitatorResourceString) => {
        const facilitatorResource = YAML.parse(facilitatorResourceString)
        faker.setPathFixture(facilitatorResource.CourseData.tennisWarmUpGuide)
        courseId = faker.getUrlId()
        folderName =
          facilitatorResource.CreateFolder.tennisWarmUpGuide.facilitatorResources.folders.week1.name
      }
    )
  })
  context(Story.manageCourse, () => {
    it('CoP Admin create folder in Facilitator Resources', () => {
      Story.ticket('QA-997')
      SignInAs.copAdmin()
      resources.visitFacilitatorResourceBy(courseId)
      resources.deleteResource(folderName)

      context('Create folder', () => {
        resources.createFolder(folderName)
        resources.expectNewFolderCreated(folderName)
      })

      context('Reset data', () => {
        resources.deleteResource(folderName)
      })
    })
  })
})
