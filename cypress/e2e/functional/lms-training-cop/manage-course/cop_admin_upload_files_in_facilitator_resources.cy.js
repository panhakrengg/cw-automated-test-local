import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let folderName
  let uploadFiles
  const faker = new Faker()
  const resources = new FacilitatorResources()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/courses/facilitator-resources.yaml').then(
      (facilitatorResourceString) => {
        const facilitatorResource = YAML.parse(facilitatorResourceString)
        faker.setPathFixture(facilitatorResource.CourseData.tennisWarmUpGuide)
        courseId = faker.getUrlId()
        const meetTraineeFolder =
          facilitatorResource.UploadFiles.tennisWarmUpGuide.facilitatorResources.folders.meetTrainee
        uploadFiles = meetTraineeFolder.files
        folderName = meetTraineeFolder.name
      }
    )
  })
  context(Story.manageCourse, () => {
    it('CoP Admin upload files in Facilitator Resources', () => {
      Story.ticket('QA-998')

      SignInAs.copAdmin()
      resources.visitFacilitatorResourceBy(courseId)
      resources.accessToFolder(folderName)

      cy.logInTestCase('Prepare data')
      resources.deleteFiles(uploadFiles)

      cy.logInTestCase('Upload files')
      resources.upload(uploadFiles)
      resources.expectNewFileUploaded(uploadFiles)
    })
  })
})
