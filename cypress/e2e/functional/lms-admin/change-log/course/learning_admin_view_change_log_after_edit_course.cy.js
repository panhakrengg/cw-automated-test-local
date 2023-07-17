import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogCourseBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, yaml, actionModifyCourse, loginModifyCourse } =
    new ChangeLogCourseBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY

  let previousCourse, courseId
  let newCourse, newCourseName
  let logCourse

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseForEditInfoLog((data) => {
        previousCourse = data.previous
        courseId = yaml.getUrlId(previousCourse)

        newCourse = data.new
        newCourseName = newCourse.name

        cy.getUserInfoByRole(userRole).then((user) => {
          logCourse = `${user.fullName} edited course ${newCourseName}.`
        })
      })
    })

    it('Learning admin view Change Log after Edit course', () => {
      Story.ticket('QA-2193')

      cy.logInTestCase('Reset Data: Remove Existing Course')
      loginModifyCourse.asLearningAdminEmery(courseId)
      actionModifyCourse.resetCourse(newCourseName, previousCourse)

      cy.logInTestCase('Edit Course')
      actionModifyCourse.editCourse(newCourse)

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logCourse, () => {
        assertion.expectToSeeDetailForEditedCourse(newCourse, previousCourse)
      })

      cy.logInTestCase('Verify change log in Course - Course changes')
      action.clickDropdownFilterByCourseChangesInCourse()
      assertion.verifyFirstCourseChangeLog(logCourse)

      cy.logInTestCase('Verify change log in Setting')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      assertion.verifyFirstCourseChangeLog(logCourse)
    })
  })
})
