import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop,{retries: 1},() => {
  let courseId
  let courseInstanceId
  let downloadFileFolders
  const faker = new Faker()
  const currentDate = new Date()
  const day = `${currentDate.getDate()}`.padStart(2, '0')
  const month = `${currentDate.getMonth() + 1}`.padStart(2, '0')
  const year = currentDate.getFullYear()
  const resources = new LearnerResources()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/learner-resources')
  before(() => {
    yamlHelper.read().then(({ CourseData, DownloadFileFolders }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      faker.setPathFixture(CourseData.tennisWarmUpGuide.courseInstances.bookedCourse)
      courseInstanceId = faker.getUrlId()
      downloadFileFolders = DownloadFileFolders
    })
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin download file/folder in Learner Resources', () => {
      Story.ticket('QA-916')
      SignInAs.copAdmin()
      resources.visitLeanerResourceBy(courseId, courseInstanceId)

      context('Download single file', () => {
        const fileName = downloadFileFolders.singleFile.files.tennisWarmUpGuide.name
        resources.downloadResources(downloadFileFolders.singleFile)
        cy.verifyDownload(fileName, {timeout: 15000})
        resources.expectDownloadedFileIncreaseViewByOne(fileName)
      })

      context('Download single folder', () => {
        resources.downloadResources(downloadFileFolders.singleFolder)
        cy.verifyDownload(
          `${downloadFileFolders.singleFolder.folders.meetTrainee.name}.zip`, {timeout: 15000})
      })

      context('Download multi file and folder', () => {
        resources.downloadResources(downloadFileFolders.multiFileFolder)
        cy.verifyDownload(`download ${day + '' + month + '' + year}.zip`, {timeout: 15000})
      })
    })
  })
})
