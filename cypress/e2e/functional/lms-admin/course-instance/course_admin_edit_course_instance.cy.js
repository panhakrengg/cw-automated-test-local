import Epic from '../../../../classes/Epic'
import CourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/CourseInstanceActions'
import ManageCourseActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseActions'
import ManageCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ManageCourseInstanceActions'
import ModifyCourseInstanceActions from '../../../../classes/lms-admin/course-instance/admin/actions/ModifyCourseInstanceActions'
import CourseInstanceOverviewAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/CourseInstanceOverviewAssertions'
import ManageCourseAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ManageCourseAssertions'
import ModifyCourseInstanceAssertions from '../../../../classes/lms-admin/course-instance/admin/assertions/ModifyCourseInstanceAssertions'
import ManageCourseInstanceQueries from '../../../../classes/lms-admin/course-instance/admin/queries/ManageCourseInstanceQueries'
import CourseInstanceYamlStub from '../../../../classes/lms-admin/course-instance/stub/CourseInstanceYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const courseInstanceYamlStub = new CourseInstanceYamlStub()
  const manageCourseInstanceActions = new ManageCourseInstanceActions()
  const manageCourseInstanceQueries = new ManageCourseInstanceQueries()
  const modifyCourseInstanceActions = new ModifyCourseInstanceActions()
  const modifyCourseInstanceAssertions = new ModifyCourseInstanceAssertions()
  const courseInstanceActions = new CourseInstanceActions()
  const courseInstanceOverviewAssertions = new CourseInstanceOverviewAssertions()
  const manageCourseActions = new ManageCourseActions()
  const manageCourseAssertions = new ManageCourseAssertions()

  context(Story.courseInstance, () => {
    let course
    let courseId
    let courseName
    let oldCourseInstance
    let newCourseInstance
    let oldInstanceTitle
    let newInstanceTitle

    before(() => {
      courseInstanceYamlStub.getCourseFuncManageInstanceForEdit((data) => {
        course = data
        courseName = course.name.value
        oldCourseInstance = course.previous.funcEditAllInfoInstance
        newCourseInstance = course.new.updateFuncEditAllInfoInstance
        oldInstanceTitle = oldCourseInstance.title.value
        newInstanceTitle = newCourseInstance.title.value
        courseId = courseInstanceYamlStub.getUrlId(course)
      })
    })

    it('Course admin edit Course Instance', () => {
      Story.ticket('QA-1857')
      signInLmsAs.couAdmin_Tressie()

      cy.logInTestCase('Reset Course Instance Details')
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceQueries
        .getActiveCourseInstanceByTitle(newInstanceTitle)
        .then(($instance) => {
          if ($instance.length) {
            manageCourseInstanceActions.clickEditCourseInstanceThreeDotItemByTitle(newInstanceTitle)
            modifyCourseInstanceActions.editCourseInstance(oldCourseInstance)
          }
        })

      cy.logInTestCase('Update Course instance Details')
      manageCourseInstanceActions.visitManageCourseInstanceByCourseId(courseId)
      manageCourseInstanceActions.clickEditCourseInstanceThreeDotItemByTitle(oldInstanceTitle)
      modifyCourseInstanceActions.editCourseInstance(newCourseInstance)
      courseInstanceOverviewAssertions.expectToSeeCourseInstanceTitle(courseName, newInstanceTitle)

      cy.logInTestCase('Verify Course Instance Details In Instance Overview')
      modifyCourseInstanceAssertions.expectToSeeSaveButtonEnabled()
      modifyCourseInstanceAssertions.expectToSeeSuccessMessageSaveCourseInstance()
      modifyCourseInstanceAssertions.expectToStayInEditCourseInstance()
      courseInstanceActions.clickOpenInstanceOverview()
      courseInstanceOverviewAssertions.expectToSeeInstanceDetails(newCourseInstance, courseName)

      cy.logInTestCase('Verify Course Instance Details In Edit Course Instance')
      courseInstanceActions.clickOpenEditInstance()
      modifyCourseInstanceAssertions.expectToSeeCourseInstanceDetails(newCourseInstance)

      cy.logInTestCase('Verify Course Instance In Manage Course')
      manageCourseActions.visitManageCourse()
      manageCourseActions.selectFilterByAll()
      manageCourseActions.searchCourse(courseName)
      manageCourseAssertions.expectToSeeCourseInstanceDetails(courseName, newCourseInstance)
    })
  })
})
