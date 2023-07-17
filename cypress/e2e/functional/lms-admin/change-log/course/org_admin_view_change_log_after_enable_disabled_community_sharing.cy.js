import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCommunityShareBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { action, assertion, loginCommunitySharing, yaml, actionCommunitySharing } =
    new ChangeLogCommunityShareBase()
  const userRole = UserRole.ORG_ADMIN.ORG_ADMIN_AMY

  let courseName, courseId
  let logDisableConsent, logEnableConsent

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getCourseSharingDeleteResourceLog((data) => {
        const course = data
        courseName = course.name
        courseId = yaml.getUrlId(course)

        cy.getUserInfoByRole(userRole).then((user) => {
          logDisableConsent = `${user.fullName} disabled share with communities for course ${courseName}.`
          logEnableConsent = `${user.fullName} enabled share with communities for course ${courseName}.`
        })
      })
    })

    it('Org admin view Change Log after Enable & Disable Community Sharing', () => {
      Story.ticket('QA-2216')

      cy.logInTestCase('Reset Data: Community Sharing is Disabled')
      loginCommunitySharing.asOrgAdminAmy(courseId)
      actionCommunitySharing.disableCommunitySharing()

      cy.logInTestCase('Enable Community Sharing')
      actionCommunitySharing.enableCommunitySharing()

      cy.logInTestCase('Disable Community Sharing')
      actionCommunitySharing.disableCommunitySharing()

      cy.logInTestCase('Verify change log in Setting')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      action.clickDropdownFilterByCourseChanges()
      assertion.verifyFirstCourseChangeLog(logDisableConsent)
      assertion.verifyFirstCourseChangeLog(logEnableConsent)
    })
  })
})
