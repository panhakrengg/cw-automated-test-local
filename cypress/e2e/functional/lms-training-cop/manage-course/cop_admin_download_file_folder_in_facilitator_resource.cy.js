import Epic from '../../../../classes/Epic'
import FacilitatorResources from '../../../../classes/lms-training-cop/FacilitatorResources'
import Story from '../../../../classes/Story'
import DateUtil from '../../../../classes/utilities/DateUtil'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let courseId
  let downloadFileFolders
  const faker = new Faker()
  const resources = new FacilitatorResources()
  const currentDate = new Date()
  const yamlHelper = new YamlHelper('/lms-training-cop/courses/facilitator-resources')
  const dateUtil = new DateUtil()

  before(() => {
    yamlHelper.read().then(({ CourseData, DownloadFileFolders }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      downloadFileFolders = DownloadFileFolders
    })
  })
  context(Story.manageCourse, () => {
    it('CoP Admin download file/folder in Facilitator Resources', () => {
      Story.ticket('QA-1000')
      SignInAs.copAdmin()
      resources.visitFacilitatorResourceBy(courseId)

      cy.logInTestCase(`Download single file`)
      const fileName = downloadFileFolders.singleFile.files.tennisWarmUpGuide.name
      resources.downloadResources(downloadFileFolders.singleFile)
      cy.verifyDownload(fileName, { timeout: 15000 })
      resources.expectDownloadedFileIncreaseViewByOne(fileName)

      cy.logInTestCase(`Download single folder`)
      resources.downloadResources(downloadFileFolders.singleFolder)
      cy.verifyDownload(`${downloadFileFolders.singleFolder.folders.meetTrainee.name}.zip`, {
        timeout: 15000,
      })

      cy.logInTestCase(`Download multi file and folder`)
      resources.downloadResources(downloadFileFolders.multiFileFolder)
      cy.verifyDownload(`download ${dateUtil.getCurrentDate('DDMMYYYY')}.zip`, { timeout: 15000 })
    })
  })
})
