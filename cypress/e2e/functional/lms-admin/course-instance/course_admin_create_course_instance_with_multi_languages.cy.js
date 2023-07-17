import Epic from '../../../../classes/Epic'
import CourseInstanceOverviewActions from '../../../../classes/lms-admin/course-instance/admin/actions/CourseInstanceOverviewActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ModifyCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ModifyCourseInstanceActions'
import CourseInstanceOverviewAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/CourseInstanceOverviewAssertions'
import CourseDetailsActions from '../../../../classes/lms-admin/course-instance/learner/actions/CourseDetailsActions'
import CourseDetailsAssertions from '../../../../classes/lms-admin/course-instance/learner/assertions/CourseDetailsAssertions'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYaml = new CourseInstanceYamlStub()
  const courseDetailsActions = new CourseDetailsActions()
  const courseDetailsAssertions = new CourseDetailsAssertions()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const courseInstanceOverviewActions = new CourseInstanceOverviewActions()
  const courseInstanceOverviewAssertions = new CourseInstanceOverviewAssertions()
  const modifyCourseInstanceActions = new ModifyCourseInstanceActions()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseInstance
    let instanceTitle

    before(() => {
      courseInstanceYaml.getCourseFuncForNewInstance((data) => {
        course = data
        courseId = courseInstanceYaml.getUrlId(course)
        courseInstance = course.instanceMultiLanguages
        instanceTitle = courseInstance.title.value
      })
    })
    it('Course Admin creates course instance with multi languages then Learner view', () => {
      Story.ticket('QA-2032')

      cy.logInTestCase('Reset Data - Remove Course Instance')
      signInLmsAs.couAdmin_Tressie()
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.archiveAndDeleteCourseInstance(instanceTitle)

      cy.logInTestCase('Create New Physical Course Instance')
      manageCourseInstanceActions.clickButtonCreateNewInstance()
      modifyCourseInstanceActions.createCourseInstance(courseInstance)
      courseInstanceOverviewActions.publishCourseInstanceWithoutActivity()

      cy.logInTestCase('Admin Verify Course Instance Overview')
      courseInstanceOverviewAssertions.expectToSeeInstanceDetails(courseInstance, course.name.value)

      cy.logInTestCase('Learner Verify Course Instance Details')
      signInLmsAs.ctgMember_Quentin()
      courseDetailsActions.visitCourseDetails(courseId)
      courseDetailsAssertions.expectToSeeCourseInstanceDetails(courseInstance)
    })
  })
})
