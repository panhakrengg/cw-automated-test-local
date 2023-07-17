import Field from '../../../../classes/constants/Field'
import Epic from '../../../../classes/Epic'
import ManageCourseActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ManageCourseAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseAssertions'
import ManageCourseInstanceAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseInstanceAssertions'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYaml = new CourseInstanceYamlStub()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const manageCourseActions = new ManageCourseActions()
  const manageCourseAssertions = new ManageCourseAssertions()
  const manageCourseInstanceAssertions = new ManageCourseInstanceAssertions()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseName
    let courseInstance
    let courseInstanceTitle

    before(() => {
      courseInstanceYaml.getCourseFuncManageInstanceForArchive((data) => {
        course = data
        courseInstance = data.funcUnarchiveInstance
        courseName = data.name.value
        courseInstanceTitle = courseInstance.title.value
        courseId = courseInstanceYaml.getUrlId(course)
      })
    })

    it('Course Admin unarchive Course Instance', () => {
      Story.ticket('QA-1855')

      cy.logInTestCase('Preset Data - course admin archive course instance')
      signInLmsAs.couAdmin_Tressie()
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.archiveAllActiveCourseInstancesWithTitle(courseInstanceTitle)

      cy.logInTestCase('Facilitator unArchived course instance')
      manageCourseInstanceActions.unArchiveAllArchivedCourseInstanceWithTitle(courseInstanceTitle)
      manageCourseInstanceActions.expandArchived()
      manageCourseInstanceAssertions.expectToSeeCorrectTotalArchivedInstance()
      manageCourseInstanceAssertions.expectToSeeActiveCourseInstanceContainsStatus(
        courseInstanceTitle
      )

      cy.logInTestCase('Facilitator check archived instance in manage course')
      manageCourseActions.visitManageCourse()
      manageCourseActions.selectFilterByDraft()
      manageCourseActions.searchCourse(courseName)
      manageCourseAssertions.expectToSeeCourseContainsInstanceWithStatus(
        courseName,
        courseInstanceTitle,
        Field.DRAFT
      )
    })
  })
})
