import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import Booking from '../../../../classes/course/Booking'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import LmsManagementHelper from '../../../../classes/lms-training-cop/base-manage-course/LmsManagementHelper'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
import LmsTrainingCopBase from '../../../../classes/lms-training-cop/base/LmsTrainingCoPBase'
import CourseDetail from '../../../../classes/lms/CourseDetail'
import Learning from '../../../../classes/lms/Learning'
import CourseActivity from '../../../../classes/lms/learner/course-instance/CourseActivity'
import LearningPathDetail from '../../../../classes/lms/learner/learning-path/LearningPathDetail'
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let lPId
  let courseId
  let courseName
  let learningPathName
  let deliveryMethod
  let hyperlink
  let duplicateInstance
  let originalInstance

  const faker = new Faker()
  const booking = new Booking()
  const learning = new Learning()
  const courseActivity = new CourseActivity()
  const courseDetail = new CourseDetail()
  const learningPathDetail = new LearningPathDetail()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const lmsTrainingCop = new LmsTrainingCopBase()

  before(() => {
    lmsTrainingCop.stub.publishUnpublishCourse.getOnlineTraining((onlineTraining) => {
      const course = onlineTraining
      courseName = course.name
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      originalInstance = course.courseInstances.duplicateQuick
      deliveryMethod = originalInstance.deliveryMethod
      hyperlink = originalInstance.activities.hyperlink
    })
    lmsTrainingCop.stub.bookLearnCourse.getLearningPath((course) => {
      duplicateInstance = course
      booking.setCourseId(courseId)
      booking.setDate(course.date)
      booking.setDeliveryMethod(course.deliveryMethod)
    })
    lmsTrainingCop.stub.bookCourse.getLpFirstClass((learningPath) => {
      faker.setPathFixture(learningPath)
      lPId = faker.getUrlId()
      learningPathName = learningPath.name
    })
  })
  after(() => {
    ReportDefect.markCwDefect(
      'CW-17535 [LMS & TCoP] Duplicate Course Instance cant publish after duplicate success'
    )
  })
  context(Story.learner, () => {
    it('Learner as CoP Owner complete course in learning path and check progress', () => {
      Story.ticket('QA-953', ['CW-17535'])

      cy.logInTestCase('Login as Cop Owner')
      SignInAs.copOwner()

      cy.logInTestCase('Prepare data')
      copManageInstance.goToCourseInstances(courseId)
      copManageInstance.archiveInstancesBy(duplicateInstance.date)
      copManageInstance.deleteArchiveInstancesBy(duplicateInstance.date)

      cy.logInTestCase('Duplicate course instance')
      copManageInstance.duplicateInstance({
        date: originalInstance.date,
        startDate: duplicateInstance.startDate,
        startTime: duplicateInstance.startTime,
        endDate: duplicateInstance.endDate,
        endTime: duplicateInstance.endTime,
      })

      cy.get('@successDuplicate').then((success) => {
        if (success) {
          cy.logInTestCase('Cop owner booking a course')
          courseDetail.visitCourseDetail(courseId)
          booking.bookByDeliveryMethodAndDate(0)

          cy.logInTestCase('Cop owner visit learning path details')
          learningPathDetail.visitLearningPathDetail(lPId)
          learningPathDetail._startCourse(courseName)
          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.completeHyperlink(hyperlink)
            courseActivity.expectActivityCompleted(hyperlink)
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('100')
          })
          learningPathDetail._clickOnLpNameBreadcrumb()
          LmsManagementHelper.expectToSeeCourseProgressBarStatus('33')

          cy.logInTestCase('Verify completed learning path in Learning page')
          learning.visitLearningPage()
          learning.showItemPerPage('75')
          learning.expectCourseHasButton(learningPathName, Field.CONTINUE)
          learning.getCourseByName(learningPathName).within(() => {
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('33')
          })
        } else {
          expect(success).to.be.true
        }
      })
    })
  })
})
