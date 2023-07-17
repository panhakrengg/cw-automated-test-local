import Epic from '../../../../classes/Epic'
import CourseDetailResource from '../../../../classes/lms-training-cop/CourseDetailResource'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import NodeChecker from '../../../../classes/utilities/NodeChecker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseInstanceId
  let folderName
  let fileName
  const faker = new Faker()
  const nodeChecker = new NodeChecker()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/learner-resources')
  const learnerResource = new LearnerResources()
  const courseDetailResource = new CourseDetailResource()
  before(() => {
    yamlHelper.read().then(({ CourseData, DownloadFileFolders }) => {
      faker.setPathFixture(CourseData.tennisWarmUpGuide)
      courseId = faker.getUrlId()
      faker.setPathFixture(CourseData.tennisWarmUpGuide.courseInstances.bookedCourse)
      courseInstanceId = faker.getUrlId()
      const folder = DownloadFileFolders.singleFileInFolder.folders.meetTrainee
      folderName = folder.name
      fileName = folder.files.tennisWarmUp.name
    })
  })
  context(Story.manageCourse, () => {
    it('Learner download file in Resources and View increase at admin side', () => {
      Story.ticket('QA-1350', ['CW-15657'])
      SignInAs.copAdmin()
      nodeChecker.setNode()
      context('Admin get view', () => {
        learnerResource.visitLeanerResourceBy(courseId, courseInstanceId)
        learnerResource.accessToFolder(folderName)
        learnerResource.getViewCount(fileName).then((oldViewCount) => {
          context('Learner download file', () => {
            SignInAs.reSignInAsCopMember()
            nodeChecker.isDifferentNodeAndLog().then(($isDifferent) => {
              if (!$isDifferent) {
                courseDetailResource.visitCourseDetailResourceBy(courseInstanceId)
                courseDetailResource.accessToFolder(folderName)
                courseDetailResource.download(fileName)
                cy.verifyDownload(fileName)

                context('Admin expect View increase 1', () => {
                  SignInAs.reSignInAsCopAdmin()
                  nodeChecker.isDifferentNodeAndLog().then(($isDifferent) => {
                    if (!$isDifferent) {
                      learnerResource.visitLeanerResourceBy(courseId, courseInstanceId)
                      learnerResource.accessToFolder(folderName)
                      learnerResource.expectViewCountIncreaseByOne(fileName, oldViewCount)
                    }
                  })
                })
              }
            })
          })
        })
      })
    })
  })
})
