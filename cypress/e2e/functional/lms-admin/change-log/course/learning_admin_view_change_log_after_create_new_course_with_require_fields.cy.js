import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogCourseBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, yaml, loginCourseList, actionCourseList, actionModifyCourse } =
    new ChangeLogCourseBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY

  let course, courseName
  let logCourse, logCollaboration

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getAuCourseRequiredFieldLog((data) => {
        course = data
        courseName = course.name

        cy.getUserInfoByRole(userRole).then((user) => {
          logCourse = `${user.fullName} created course ${courseName}.`
          logCollaboration = `${user.fullName} edited Collaboration Settings for the course ${courseName}.`
        })
      })
    })

    it('Learning admin view Change Log after Create new course with require fields', () => {
      Story.ticket('QA-2191')

      cy.logInTestCase('Reset Data: Remove Existing Course')
      loginCourseList.asLearningAdminEmery()
      actionCourseList.deleteCourseIfExist(courseName)

      cy.logInTestCase('Create Course')
      actionModifyCourse.visitCreateCourseOrgLms()
      actionModifyCourse.createNewCourse(course)

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logCollaboration, () => {
        assertion.expectToSeeDetailForCollaborationCourse(course)
      })
      assertion.verifyFirstCourseChangeLog(logCourse, () => {
        assertion.expectToSeeDetailForCreatedCourse(course)
      })

      cy.logInTestCase('Verify change log in Course - Course changes')
      action.clickDropdownFilterByCourseChangesInCourse()
      assertion.verifyFirstCourseChangeLog(logCollaboration)
      assertion.verifyFirstCourseChangeLog(logCourse)

      cy.logInTestCase('Verify change log in Setting')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      assertion.verifyFirstCourseChangeLog(logCollaboration)
      assertion.verifyFirstCourseChangeLog(logCourse)
    })
  })
})
