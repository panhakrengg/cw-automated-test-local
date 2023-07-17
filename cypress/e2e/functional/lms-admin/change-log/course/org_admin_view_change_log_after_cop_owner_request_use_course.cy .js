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
    login,
    loginCommunitySharing,
    loginCourseList,
    yaml,
  } = new ChangeLogCommunityShareBase()
  const userRole = UserRole.CoPAdministrationUser.OWNER_PHOEBE

  let courseName, courseId
  let tCopName, tCopUrl
  let userFullName, logRequested

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getTCopFuncRequestToUseSharedCourse((tCop) => {
        tCopName = tCop.name
        tCopUrl = tCop.url
      })

      yaml.getRequestWithoutPermission((course) => {
        courseName = course.name
        courseId = yaml.getUrlId(course)
      })

      cy.getUserInfoByRole(userRole).then((user) => {
        userFullName = user.fullName
      })
    })

    it('Org admin view Change Log after Cop owner Request to Use share course to community', () => {
      Story.ticket('QA-2215')

      logRequested = `${userFullName} requested to use course ${courseName} in ${tCopName} community.`

      cy.logInTestCase('Reset Data: Remove approved communities')
      loginCommunitySharing.asOrgAdminAmy(courseId)
      actionCommunitySharing.resetToRemoveCommunity(tCopName)

      cy.logInTestCase('Add Existing Course')
      loginCourseList.asCopOwnerPhoebe(tCopUrl)
      actionCourseList.addExistingCourse(courseName)

      cy.logInTestCase('Org admin: Verify change log in Settings - Course changes')
      login.orgAdminAmy()
      action.clickLinkChangeLog()
      action.clickDropdownFilterByCourseChanges()
      assertion.verifyFirstCourseChangeLog(logRequested)
    })
  })
})

