import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let folderHasFileInside
  let folderHasNoFileInside
  const faker = new Faker()
  const resources = new FacilitatorResources()
  before(() => {
    cy.readFile('cypress/fixtures/lms-training-cop/courses/facilitator-resources.yaml').then(
      (facilitatorResourceString) => {
        const facilitatorResource = YAML.parse(facilitatorResourceString)
        const tennisWarmUpGuide = facilitatorResource.CourseData.tennisWarmUpGuide
        const folders = tennisWarmUpGuide.facilitatorResources.folders
        faker.setPathFixture(tennisWarmUpGuide)
        courseId = faker.getUrlId()
        folderHasFileInside = folders.introduction.name
        folderHasNoFileInside = folders.morningExercise.name
      }
    )
  })
  context(Story.manageCourse, () => {
    it('CoP Admin able to see Facilitator Resource', () => {
      Story.ticket('QA-1329')
      SignInAs.copAdmin()
      resources.visitFacilitatorResourceBy(courseId)
      resources.expectToSeeResourcesPage()

      context('Verify upload popup', () => {
        resources.clickUpload()
        resources.expectToSeeUploadPopup()
      })

      context('Verify new folder popup', () => {
        resources.clickNewFolder()
        resources.verifyNewFolderPopup()
      })

      context('Verify delete single file popup', () => {
        resources.selectFileFirstRow()
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete this file?')
        resources.selectFileFirstRow()
      })

      context('Verify delete single folder popup - has file inside', () => {
        resources.selectResource(folderHasFileInside)
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete this folder?')
        resources.selectResource(folderHasFileInside)
      })

      context('Verify delete single folder popup - no file/folder inside', () => {
        resources.selectResource(folderHasNoFileInside)
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete this folder?')
        resources.selectResource(folderHasNoFileInside)
      })

      context('Verify delete multiple folders popup', () => {
        resources.selectFolderFirstRow()
        resources.selectFolderSecondRow()
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete this 2 folders?')
        resources.selectFolderFirstRow()
        resources.selectFolderSecondRow()
      })

      context('Verify delete multiple files popup', () => {
        resources.selectFileFirstRow()
        resources.selectFileSecondRow()
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete these 2 files?')
        resources.selectFileFirstRow()
        resources.selectFileSecondRow()
      })

      context('Verify delete file/folder popup', () => {
        resources.selectFolderFirstRow()
        resources.selectFileSecondRow()
        resources.clickDelete()
        resources.expectToSeeConfirmDeletePopupWithTitle('Would you like to delete these 2 items?')
      })
    })
  })
})
