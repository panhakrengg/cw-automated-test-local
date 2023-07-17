import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCommunityShareBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  const {
    action,
    actionCommunitySharing,
    actionCourseList,
    assertion,
    loginCommunitySharing,
    yaml,
  } = new ChangeLogCommunityShareBase()
  const userRole = UserRole.ORG_ADMIN.ORG_ADMIN_AMY

  let courseName, courseId
  let tCop, tCopName, tCopUrl
  let logApproved, logSuggested

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getSuggestThenApprove((data) => {
        const course = data
        courseName = course.name
        courseId = yaml.getUrlId(course)

        tCop = course.communitySharing.suggestCommunity.tCopSuggestSharedCourse
        tCopName = tCop.name
        tCopUrl = tCop.url

        cy.getUserInfoByRole(userRole).then((user) => {
          logApproved = `${user.fullName} approved a suggestion to use course ${courseName} in ${tCopName}.`
          logSuggested = `${user.fullName} suggested the course ${courseName} to ${tCopName}.`
        })
      })
    })

    it('Org admin view Change Log after Suggest & Approve share course to communities', () => {
      Story.ticket('QA-2221')

      cy.logInTestCase('Reset Data: Remove approved  & suggested communities')
      loginCommunitySharing.asOrgAdminAmy(courseId)
      actionCommunitySharing.resetToRemoveCommunity(tCopName)

      cy.logInTestCase('Suggest to communities')
      actionCommunitySharing.suggestCommunity(tCop)

      cy.logInTestCase('Approve share in community')
      actionCourseList.visitCop(tCopUrl)
      actionCourseList.approveShareCourse(courseName)

      cy.logInTestCase('Verify change log in Course')
      action.visitCourseLevel(courseId)
      assertion.verifyFirstSharedCourseChangeLog(logApproved)
      assertion.verifyFirstSharedCourseChangeLog(logSuggested)

      cy.logInTestCase('Verify change log in Settings')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      action.clickDropdownFilterByCourseChanges()
      assertion.verifyFirstSharedCourseChangeLog(logApproved)
      assertion.verifyFirstSharedCourseChangeLog(logSuggested)
    })
  })
})
