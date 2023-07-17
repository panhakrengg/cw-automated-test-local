import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import Field from '../../../../classes/constants/Field'
import Booking from '../../../../classes/course/Booking'
import CopManageInstance from '../../../../classes/lms-training-cop/CopManageInstance'
import LmsManagementHelper from '../../../../classes/lms-training-cop/base-manage-course/LmsManagementHelper'
import { CoPConst } from '../../../../classes/lms-training-cop/base/CoPStub'
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
  let originalInstance
  let duplicateInstance
  let hyperlink
  let physicalClassroom
  let virtualClassroom

  const faker = new Faker()
  const booking = new Booking()
  const learning = new Learning()
  const courseDetail = new CourseDetail()
  const courseActivity = new CourseActivity()
  const copManageInstance = new CopManageInstance(`${CoPConst.URL}/admin/admin`)
  const yamlHelper = new YamlHelper(
    'lms-training-cop/course-instances/learn-quick-has-sequential-optional'
  )
  before(() => {
    yamlHelper.read().then(({ CourseData, CourseProgress }) => {
      const course = CourseData.learnQuickHasSequentialOptional
      originalInstance = course.duplicateQuickSequentialOptional
      duplicateInstance = CourseProgress.quickSequentialOptional
      faker.setPathFixture(course)
      courseId = faker.getUrlId()
      courseName = course.name
      virtualClassroom = originalInstance.activities.virtualTalking
      physicalClassroom = originalInstance.activities.physicalTrainAtSchool
      hyperlink = originalInstance.activities.hyperlink
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
    it('Learner complete activities, has sequential, & optional - Hyperlink, Physical & Virtual Class', () => {
      Story.ticket('QA-945', ['CW-17535'])

      cy.logInTestCase('SignIn as Cop Admin')
      SignInAs.copAdmin()

      cy.logInTestCase('Prepare date')
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
          cy.logInTestCase('Learner complete activities has sequential')
          SignInAs.reSignInAsCopMember()
          courseDetail.visitCourseDetail(courseId)
          booking.bookByDeliveryMethodAndDate(0)

          cy.logInTestCase('Verify activities sequential')
          courseActivity.expectHyperlinkEnable(hyperlink)
          courseActivity.expectPhysicalClassEnable(physicalClassroom, false)
          courseActivity.expectVirtualClassEnable(virtualClassroom, false)

          cy.logInTestCase('Leaner complete hyperlink activity')
          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.completeHyperlink(hyperlink)
            cy.wait(1000)
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
            courseActivity.expectActivityCompleted(hyperlink)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('33')
          })
          cy.logInTestCase('Leaner complete physical class activity')
          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.expectPhysicalClassEnable(physicalClassroom)
            courseActivity.skipActivity(physicalClassroom)
            cy.wait(1000)
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
            courseActivity.expectActivityCompleted(physicalClassroom)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('67')
          })
          cy.logInTestCase('Leaner complete virtual class activity')
          courseActivity.getCompletedActivityCount().then((completeCount) => {
            courseActivity.expectVirtualClassEnable(virtualClassroom)
            courseActivity.skipActivity(virtualClassroom)
            courseDetail._itchFetchCourseDetail.set()
            courseDetail._itchFetchCourseDetail.wait()
            cy.wait(1000)
            courseActivity.expectCompletedActivityIncreasedByOne(completeCount)
            courseActivity.expectActivityCompleted(virtualClassroom)
            LmsManagementHelper.expectToSeeCourseProgressBarStatus('100')
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
