import Field from '../../../../classes/constants/Field'
import Epic from '../../../../classes/Epic'
import ManageCourseActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ManageCourseAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseAssertions'
import ManageCourseInstanceAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseInstanceAssertions'
import InstanceOverviewActions from '../../../../classes/lms-admin/course-instance/learner/actions/InstanceOverviewActions'
import InstanceOverviewAssertions from '../../../../classes/lms-admin/course-instance/learner/assertions/InstanceOverviewAssertions'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYamlStub = new CourseInstanceYamlStub()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const manageCourseActions = new ManageCourseActions()
  const manageCourseAssertions = new ManageCourseAssertions()
  const instanceOverviewActions = new InstanceOverviewActions()
  const instanceOverviewAssertions = new InstanceOverviewAssertions()
  const manageCourseInstanceAssertions = new ManageCourseInstanceAssertions()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseName
    let courseInstanceId
    let courseInstance
    let courseInstanceTitle

    before(() => {
      courseInstanceYamlStub.getCourseFuncManageInstanceForArchive((data) => {
        course = data
        courseInstance = data.funcArchiveInstance
        courseName = data.name.value
        courseInstanceTitle = courseInstance.title.value
        courseId = courseInstanceYamlStub.getUrlId(course)
        courseInstanceId = courseInstanceYamlStub.getUrlId(courseInstance)
      })
    })

    it('Course Admin archive course instance then Learner still able to access', () => {
      Story.ticket('QA-1851')
      cy.logInTestCase('Reset Data: Facilitator unArchived course instance')
      signInLmsAs.couAdmin_Tressie()
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.unArchiveAllArchivedCourseInstanceWithTitle(courseInstanceTitle)

      cy.logInTestCase('Facilitator archive course instance')
      manageCourseInstanceActions.archiveAllActiveCourseInstancesWithTitle(courseInstanceTitle)
      manageCourseInstanceActions.expandArchived()
      manageCourseInstanceAssertions.expectToSeeCorrectTotalArchivedInstance()
      manageCourseInstanceAssertions.expectToSeeArchivedCourseInstanceContainsStatus(
        courseInstanceTitle
      )

      cy.logInTestCase('Facilitator check archived instance in manage course')
      manageCourseActions.visitManageCourse()
      manageCourseActions.selectFilterByArchived()
      manageCourseActions.searchCourse(courseName)
      manageCourseAssertions.expectToSeeCourseContainsInstanceWithStatus(
        courseName,
        courseInstanceTitle,
        Field.ARCHIVED
      )

      cy.logInTestCase('Learner still able to access archived instance')
      signInLmsAs.istMember_Mallory()
      instanceOverviewActions.visitCourseInstanceOverview(courseInstanceId)
      instanceOverviewAssertions.expectToSeeCourseInstanceTitle(courseName, courseInstanceTitle)
    })
  })
})
