import Epic from '../../../../classes/Epic'
import CourseDetailResource from '../../../../classes/lms-training-cop/CourseDetailResource'
import LearnerResources from '../../../../classes/lms-training-cop/LearnerResources'
import ManageCourses from '../../../../classes/lms/ManageCourses'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import NodeChecker from '../../../../classes/utilities/NodeChecker'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsLearner, { retries: 1 }, () => {
  const manageCourse = new ManageCourses()
  const signInLmsAs = new SignInLmsAs()
  const faker = new Faker()
  const learnerResources = new LearnerResources()
  const courseDetailResource = new CourseDetailResource()
  const nodeChecker = new NodeChecker()

  context(Story.resources, { retries: 2 }, () => {
    let courseId
    let courseInstanceId
    let scheduleDate
    let folderName
    let fileName

    before(() => {
      new YamlHelper('lms/sample-lms').read().then(({ CourseData }) => {
        const course = CourseData.resourcesNotesDiscussion
        const instance = course.noteInstance
        const tennisWarmUpFolder = instance.learnerResources.folders.tennisWarmUp
        faker.setPathFixture(course)
        courseId = faker.getUrlId()
        faker.setPathFixture(instance)
        courseInstanceId = faker.getUrlId()
        scheduleDate = instance.date
        folderName = tennisWarmUpFolder.name
        fileName = tennisWarmUpFolder.files[0]
      })
    })
    it('Instance Member download file in Resources and View increase at admin side', () => {
      Story.ticket('QA-1507')

      context('Admin get view', () => {
        signInLmsAs.istAdmin_Frances()
        nodeChecker.setNode()
        manageCourse.accessCourseInstanceBy(courseId, courseInstanceId, 'Learner Resources')
        learnerResources.accessToFolder(folderName)

        learnerResources.getViewCount(fileName).then((oldViewCount) => {
          signInLmsAs.istMember_Mallory()
          nodeChecker.isDifferentNodeAndLog().then(($isDifferent) => {
            if (!$isDifferent) {
              context('Learner download file', () => {
                courseDetailResource.visitCourseDetailResourceBy(courseInstanceId)
                courseDetailResource.accessToFolder(folderName)
                courseDetailResource.download(fileName)
                cy.verifyDownload(fileName)
              })

              context('Admin expect View increase 1', () => {
                signInLmsAs.istAdmin_Frances()
                manageCourse.accessCourseInstanceBy(courseId, courseInstanceId, 'Learner Resources')
                learnerResources.accessToFolder(folderName)
                learnerResources.expectViewCountIncreaseByOne(fileName, oldViewCount)
              })
            }
          })
        })
      })
    })
  })
})
