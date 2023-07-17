import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCommunityShareBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, loginCommunitySharing, yaml, actionCommunitySharing } =
    new ChangeLogCommunityShareBase()
  const userRole = UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON

  let courseName, courseId
  let logEdited

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getAllowDuplicateEnablePermission((data) => {
        const course = data
        courseName = course.name
        courseId = yaml.getUrlId(course)

        cy.getUserInfoByRole(userRole).then((user) => {
          logEdited = `${user.fullName} edited Community Sharing settings for course ${courseName}.`
        })
      })
    })

    it('Category admin view Change Log after Disable allow duplicate & Enable Require permission', () => {
      Story.ticket('QA-2219')

      cy.logInTestCase('Reset Data: All duplicate is Enabled & Require permission is Disabled')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.enableAllowDuplicate()
      actionCommunitySharing.disableRequirePermission()

      cy.logInTestCase('Disable All duplicate')
      actionCommunitySharing.disableAllowDuplicate()

      cy.logInTestCase('Enable Require permission')
      actionCommunitySharing.enableRequirePermission()

      cy.logInTestCase('Verify change log in Setting')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstRequestPermissionChangeLog(logEdited, true)
      assertion.verifyFirstAllowDuplicationChangeLog(logEdited, false)
    })
  })
})
