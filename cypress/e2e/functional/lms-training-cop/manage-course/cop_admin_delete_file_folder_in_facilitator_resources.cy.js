import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let introductionFolder
  let weekenTimeFolder
  let tennisPlayGround
  const faker = new Faker()
  const resources = new FacilitatorResources()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/courses/facilitator-resources.yaml').then(
      (facilitatorResourceString) => {
        const facilitatorResource = YAML.parse(facilitatorResourceString)
        const deleteFileFolders = facilitatorResource.DeleteFileFolders
        faker.setPathFixture(facilitatorResource.CourseData.tennisWarmUpGuide)
        courseId = faker.getUrlId()
        introductionFolder = deleteFileFolders.singleFolder.folders.introduction
        weekenTimeFolder = deleteFileFolders.multiFileFolder.folders.weekendTime
        tennisPlayGround = deleteFileFolders.multiFileFolder.files
      }
    )
  })
  context(Story.manageCourse, () => {
    it('CoP Admin delete file/folder in Facilitator Resources', () => {
      Story.ticket('QA-1330')
      SignInAs.copAdmin()
      const introductionFolderName = introductionFolder.name
      const weekenTimeFolderName = weekenTimeFolder.name
      const tennisPlayGroundFileName = tennisPlayGround.tennisPlayground.name
      resources.visitFacilitatorResourceBy(courseId)

      cy.logInTestCase('Delete single')
      resources.deleteResource(introductionFolderName)
      resources.expectResourceDeleted(introductionFolderName)

      cy.logInTestCase('Delete multiple')
      resources.selectResource(weekenTimeFolderName)
      resources.selectResource(tennisPlayGroundFileName)
      resources.delete()
      resources.expectResourceDeleted(weekenTimeFolderName)
      resources.expectResourceDeleted(tennisPlayGroundFileName)

      cy.logInTestCase('Reset data')
      resources.createFolder(introductionFolderName)
      resources.createFolder(weekenTimeFolderName)
      resources.upload(tennisPlayGround)
      resources.accessToFolder(introductionFolderName)
      resources.upload(introductionFolder.files)
    })
  })
})
