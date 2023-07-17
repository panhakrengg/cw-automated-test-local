import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import CopManageCourse from '../../../../classes/lms-training-cop/CopManageCourse'
import LearningCoP from '../../../../classes/lms-training-cop/LearningCoP'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import CourseCatalog from '../../../../classes/lms/CourseCatalog'
import PublishUnPublishCourse from '../../../../classes/lms/PublishUnPublishCourse'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, () => {
  let courseId
  let courseName
  const faker = new Faker()
  const actorName = 'au_copadmin'
  const courseCatalog = new CourseCatalog()
  const copManageCourse = new CopManageCourse()
  const publishUnPublishCourse = new PublishUnPublishCourse()
  const learningCop = new LearningCoP(CoPConst.URL)
  copManageCourse.setCopAdminUrl(CoPConst.URL)
  const yamlHelper = new YamlHelper('lms-training-cop/courses/unpublish-course')
  before(() => {
    yamlHelper.read().then(({ CourseData }) => {
      const course = CourseData.typedRacket
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
      copManageCourse.setCourse(course)
    })
  })

  after(() => {
    ReportDefect.markCwDefect(
      'After publish course, the course is not displayed in CoP Learning Tab'
    )
  })

  context(Story.manageCourse, () => {
    it('CoP Admin unpublish course', () => {
      Story.ticket('QA-1079')
      SignInAs.copAdmin()
      copManageCourse.goToCourseOverview(courseId)

      context('Prepare data', () => {
        publishUnPublishCourse.publish()
      })

      context('CoP Admin unPublish course', () => {
        publishUnPublishCourse.unPublish()
      })

      context('Search unPublished course', () => {
        copManageCourse.backToManageCourses()
        copManageCourse.verifyCourseCardInManageCourse(false, Field.ALL)
      })

      context('Verify published course in CoP Learning Tab', () => {
        learningCop.visitLearning()
        learningCop.expectNotSeeCourse(courseName)
      })

      context('Verify course detail', () => {
        learningCop.visitCourseDetail(courseId)
        cy.denialPage(
          'This link is not available.',
          'This link may only be visible to a community you’re not a part of.'
        )
        courseCatalog.visitCourseDetail(courseId)
        cy.denialPage(
          'This content is not available.',
          'The link you followed may be broken or you may not have permission to view this page.'
        )
      })

      context('Another CoP Admin verify the updated course', () => {
        SignInAs.reSignInAsCopAdminSecond()
        publishUnPublishCourse.expectToSeeUpdateCourseNotification(actorName, courseName).click()
        publishUnPublishCourse.expectUnPublished()
      })

      context('Reset data', () => {
        copManageCourse.goToCourseOverview(courseId)
        publishUnPublishCourse.publish()
      })
    })
  })
})
