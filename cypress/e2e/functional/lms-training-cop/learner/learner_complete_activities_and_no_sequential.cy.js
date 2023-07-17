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
import Faker from '../../../../classes/utilities/Faker'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInAs from '../../../../classes/utilities/SignInAs'
import YamlHelper from '../../../../classes/utilities/YamlHelper'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  let courseId
  let courseName
  let file
  let learningGoal
  let duplicateInstance
  let originalInstance

  const faker = new Faker()
  const booking = new Booking()
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const courseActivity = new CourseActivity()
  const yamlHelper = new YamlHelper('lms-training-cop/course-instances/learn-quick-no-sequential')
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)

  before(() => {
    yamlHelper.read().then(({ CourseData, CourseProgress }) => {
      const course = CourseData.learnQuickNoSequential
      originalInstance = course.duplicateQuick
      duplicateInstance = CourseProgress.quick
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
      file = originalInstance.activities.fileImage
      learningGoal = originalInstance.activities.learningGoal
      booking.setCourseId(courseId)
      booking.setDate(duplicateInstance.date)
      booking.setDeliveryMethod(originalInstance.deliveryMethod)
    })
  })
  after(() => {
    ReportDefect.markCwDefect(
      'CW-17535 [LMS & TCoP] Duplicate Course Instance cant publish after duplicate success'
    )
  })
  context(Story.learner, () => {
    it('Learner complete activities & no sequential', () => {
      Story.ticket('QA-943', ['CW-17535'])

      cy.logInTestCase('Login as Cop Admin')
      SignInAs.copAdmin()

      cy.logInTestCase('Prepare data')
      copManageInstance.goToCourseInstances(courseId)
      copManageInstance.archiveInstancesBy(duplicateInstance.date)
      copManageInstance.deleteArchiveInstancesBy(duplicateInstance.date)

      cy.logInTestCase('Duplicate instance by date')
      copManageInstance.duplicateInstance({
        date: originalInstance.date,
        startDate: duplicateInstance.startDate,
        startTime: duplicateInstance.startTime,
        endDate: duplicateInstance.endDate,
        endTime: duplicateInstance.endTime,
      })

      cy.get('@successDuplicate').then((success) => {
        if (success) {
          cy.logInTestCase('Learner complete activities & no sequential')
          SignInAs.reSignInAsCopContactManager()
          courseDetail.visitCourseDetail(courseId)
          booking.bookByDeliveryMethodAndDate(0)
          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.completeLearningGoal(learningGoal)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('50')
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
          })

          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.completeFile(file)
            courseActivity.expectActivityCompleted(file)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('100')
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
          })

          cy.logInTestCase('Leaner verify completed course')
          learning.visitLearningPage()
          learning.showItemPerPage(75)
          learning.expectCourseHasButton(courseName, Field.COMPLETED)
          learning.viewMyCoursesByCourseName(courseName)
          learning.expectBookedInstanceNoWithdraw(duplicateInstance.date)
        } else {
          expect(success).to.be.true
        }
      })
    })
  })
})
