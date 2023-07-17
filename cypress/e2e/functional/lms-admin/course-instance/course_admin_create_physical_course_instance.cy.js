import Epic from '../../../../classes/Epic'
import CourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/CourseInstanceActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ModifyCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ModifyCourseInstanceActions'
import ManageCourseInstanceAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseInstanceAssertions'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYamlStub = new CourseInstanceYamlStub()
  const courseInstanceActions = new CourseInstanceActions()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const manageCourseInstanceAssertions = new ManageCourseInstanceAssertions()
  const modifyCourseInstanceActions = new ModifyCourseInstanceActions()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseInstance
    let instanceTitle

    before(() => {
      courseInstanceYamlStub.getCourseFuncForNewInstance((data) => {
        course = data
        courseId = courseInstanceYamlStub.getUrlId(course)
        courseInstance = course.instancePhysicalClass
        instanceTitle = courseInstance.title.value
      })
    })
    it('Course admin create Physical Classroom Course Instance', () => {
      Story.ticket('QA-2008')
      signInLmsAs.couAdmin_Tressie()

      cy.logInTestCase('Reset Data - Remove Course Instance')
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.archiveAndDeleteCourseInstance(instanceTitle)

      cy.logInTestCase('Create New Physical Course Instance')
      manageCourseInstanceActions.clickButtonCreateNewInstance()
      modifyCourseInstanceActions.createCourseInstance(courseInstance)

      cy.logInTestCase('Verify Course Instance In Manage Course Instance')
      courseInstanceActions.clickBackLinkIcon()
      manageCourseInstanceAssertions.expectToSeeCourseInstanceDetailsByInstanceTitle(courseInstance)
    })
  })
})
