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
      yaml.getCourseForDisabledEnableDiscussionLog((data) => {
        course = data
        courseId = yaml.getUrlId(course)
        courseName = course.name

        cy.getUserInfoByRole(userRole).then((user) => {
          logEditCollaboration = `${user.fullName} edited Collaboration Settings for the course ${courseName}.`
        })
      })
    })

    const verifyEditDiscussion = () => {
      assertion.verifyFirstCourseChangeLog(logEditCollaboration, () => {
        assertion.expectToSeeDetailForEnableDiscussion()
      })
      assertion.verifySecondCourseChangeLog(logEditCollaboration, () => {
        assertion.expectToSeeDetailForDisableDiscussion()
      })
    }

    it('Learning admin view Change Log after Edit collaboration course by Disable & Enable Discussion', () => {
      Story.ticket('QA-2195')

      cy.logInTestCase('Reset Data: discussion is enabled')
      loginModifyCourse.asLearningAdminEmery(courseId)
      actionModifyCourse.resetEnableDiscussion()

      cy.logInTestCase('Disable discussion')
      actionModifyCourse.disableDiscussion()

      cy.logInTestCase('Enable discussion')
      actionModifyCourse.enableDiscussion()

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      verifyEditDiscussion()

      cy.logInTestCase('Verify change log in Setting - Course changes')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      action.clickDropdownFilterByCourseChanges()
      verifyEditDiscussion()
    })
  })
})
