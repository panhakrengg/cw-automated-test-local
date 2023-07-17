import Environment from '../../../../classes/base/Environment'
import Epic from '../../../../classes/Epic'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseName
  let courseId
  let courseInstanceId
  let singleFolder
  let multiFileFolder
  let copAdminScreenName
  const faker = new Faker()
  const learnerResources = new LearnerResources()
  const learnerResource = new YamlHelper('lms-training-cop/course-instances/learner-resources')
  const users = new YamlHelper('users')
  before(() => {
    learnerResource.read().then(({ CourseData, DeleteFileFolders }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      faker.setPathFixture(CourseData.tennisWarmUpGuide.courseInstances.bookedCourse)
      courseInstanceId = faker.getUrlId()
      courseName = CourseData.tennisWarmUpGuide.name
      singleFolder = DeleteFileFolders.singleFolder
      multiFileFolder = DeleteFileFolders.multiFileFolder
    })
    users.read().then(({ Users }) => {
      copAdminScreenName = Users.uat.wpAdmin.screenName
    })
    SignInAs.copAdmin()
  })
  context(Story.manageCourseInstance, () => {
    it('CoP Admin delete file/folder in Learner Resources', () => {
      Story.ticket('QA-1350')
      const introductionFolderName = singleFolder.folders.introduction.name
      const weekendTimeFolderName = multiFileFolder.folders.weekendTime.name
      const tennisPlaygroundFileName = multiFileFolder.files.tennisPlayground.name

      cy.logInTestCase('Reset data')
      learnerResources.visitLeanerResourceBy(courseId, courseInstanceId)
      cy.waitLoadingOverlayNotExist()
      cy.wait(2000)
      learnerResources.deleteResource(introductionFolderName)
      learnerResources.expectResourceDeleted(introductionFolderName)
      learnerResources.deleteResource(weekendTimeFolderName)
      learnerResources.expectResourceDeleted(weekendTimeFolderName)

      cy.logInTestCase('Prepare data')
      learnerResources.createFolder(introductionFolderName)
      learnerResources.createFolder(weekendTimeFolderName)
      learnerResources.accessToFolder(introductionFolderName)
      learnerResources.upload(singleFolder.folders.introduction.files)

      cy.logInTestCase('Delete single folder')
      learnerResources.deleteResource(introductionFolderName)
      learnerResources.expectResourceDeleted(introductionFolderName)

      cy.logInTestCase('Delete multi file folder')
      learnerResources.selectResource(weekendTimeFolderName)
      learnerResources.selectResource(tennisPlaygroundFileName)
      learnerResources.delete()
      learnerResources.expectResourceDeleted(weekendTimeFolderName)
      learnerResources.expectResourceDeleted(tennisPlaygroundFileName)

      cy.logInTestCase('Verify resources was deleted with other admin')
      const envrionment = new Environment()
      SignInAs.reSignInAsCopAdminSecond()
      if (envrionment.isBeta) {
        // Noted: We don't have notification in Beta environment
        learnerResources.visitLeanerResourceBy(courseId, courseInstanceId)
      } else {
        learnerResources.accessToLearnerResourcesViaWebNotification(copAdminScreenName, courseName)
      }
      learnerResources.expectResourceDeleted(introductionFolderName)
      learnerResources.expectResourceDeleted(weekendTimeFolderName)
      learnerResources.expectResourceDeleted(tennisPlaygroundFileName)
    })
  })
})
