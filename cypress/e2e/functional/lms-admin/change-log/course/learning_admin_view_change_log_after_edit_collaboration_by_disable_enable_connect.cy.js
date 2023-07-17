import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogCourseBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, yaml, actionModifyCourse, loginModifyCourse } =
    new ChangeLogCourseBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY

  let course, courseId, courseName
  let logEditCollaboration

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseForDisabledEnableConnectLog((data) => {
        course = data
        courseId = yaml.getUrlId(course)
        courseName = course.name

        cy.getUserInfoByRole(userRole).then((user) => {
          logEditCollaboration = `${user.fullName} edited Collaboration Settings for the course ${courseName}.`
        })
      })
    })

    const verifyEditConnect = () => {
      assertion.verifyFirstCourseChangeLog(logEditCollaboration, () => {
        assertion.expectToSeeDetailForEnableConnect()
      })
      assertion.verifySecondCourseChangeLog(logEditCollaboration, () => {
        assertion.expectToSeeDetailForDisableConnect()
      })
    }

    it('Learning admin view Change Log after Edit collaboration course by Disable & Enable Connect', () => {
      Story.ticket('QA-2196')

      cy.logInTestCase('Reset Data: connect is enabled')
      loginModifyCourse.asLearningAdminEmery(courseId)
      actionModifyCourse.resetEnableConnect()

      cy.logInTestCase('Disable connect')
      actionModifyCourse.disableConnect()

      cy.logInTestCase('Enable connect')
      actionModifyCourse.enableConnect()

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      verifyEditConnect()

      cy.logInTestCase('Verify change log in Setting - Course changes')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      action.clickDropdownFilterByCourseChanges()
      verifyEditConnect()
    })
  })
})
