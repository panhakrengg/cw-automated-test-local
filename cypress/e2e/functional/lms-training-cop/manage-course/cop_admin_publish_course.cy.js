import Epic from '../../../../classes/Epic'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import CourseCatalog from '../../../../classes/lms/CourseCatalog'
import PublishUnPublishCourse from '../../../../classes/lms/PublishUnPublishCourse'
import Story from '../../../../classes/Story'
import Faker from '../../../../classes/utilities/Faker'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let courseId
  let courseName
  let copManageCourse
  const faker = new Faker()
  const actorName = 'au_copadmin'
  const learningCop = new LearningCoP(CoPConst.URL)
  const courseCatalog = new CourseCatalog()
  const publishUnPublishCourse = new PublishUnPublishCourse()
  const lmsTrainingCop = new LmsTrainingCopBase()

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse((course) => {
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
      copManageCourse = new CopManageCourse(course)
      copManageCourse.setCourse(course)
      copManageCourse.setCopAdminUrl(CoPConst.URL)
    })
  })

  context(Story.manageCourse, () => {
    it('CoP Admin publish course', () => {
      Story.ticket('QA-1078')
      SignInAs.copAdmin()
      copManageCourse.goToCourseOverview(courseId)

      context('Prepare data', () => {
        publishUnPublishCourse.unPublish()
      })

      context('CoP Admin publish course', () => {
        publishUnPublishCourse.publish()
      })

      context('Search published course', () => {
        copManageCourse.backToManageCourses()
        copManageCourse.verifyCourseCardInManageCourse()
      })

      context('Verify published course in CoP Learning Tab', () => {
        learningCop.visitLearning()
        learningCop.expectToSeeCourse(courseName)
      })

      context('Verify course detail', () => {
        learningCop.visitCourseDetail(courseId)
        learningCop.expectToSeeCourseDetailPage()
        courseCatalog.visitCourseDetail(courseId)
        courseCatalog.expectToSeeCourseDetailPage()
      })

      context('Another CoP Admin verify the updated course', () => {
        SignInAs.reSignInAsCopAdminSecond()
        publishUnPublishCourse.expectToSeeUpdateCourseNotification(actorName, courseName).click()
        publishUnPublishCourse.expectPublished()
      })
    })
  })
})
