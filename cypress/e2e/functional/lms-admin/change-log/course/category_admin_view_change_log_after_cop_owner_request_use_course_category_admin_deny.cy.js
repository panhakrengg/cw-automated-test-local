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
    loginCourseList,
    yaml,
  } = new ChangeLogCommunityShareBase()
  const copOwner = UserRole.CoPAdministrationUser.OWNER_PHOEBE
  const categoryAdmin = UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON

  let courseName, courseId
  let tCopName, tCopUrl
  let copOwnerFullName, categoryAdminFullName, logRequested, logDenied

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getTCopFuncRequestToUseSharedCourse((tCop) => {
        tCopName = tCop.name
        tCopUrl = tCop.url
      })

      yaml.getRequestThenDeny((course) => {
        courseName = course.name
        courseId = yaml.getUrlId(course)
      })

      cy.getUserInfoByRole(copOwner).then((user) => (copOwnerFullName = user.fullName))
      cy.getUserInfoByRole(categoryAdmin).then((user) => (categoryAdminFullName = user.fullName))
    })

    it('Category admin view Change Log after Cop owner Request to Use share course and category admin Deny', () => {
      Story.ticket('QA-2217')

      logRequested = `${copOwnerFullName} requested to use course ${courseName} in ${tCopName} community.`
      logDenied = `${categoryAdminFullName} denied a request to use course ${courseName} in ${tCopName}.`

      cy.logInTestCase('Reset Data: Remove communities')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.resetToRemoveCommunity(tCopName)

      cy.logInTestCase('Cop owner: Add Existing Course')
      loginCourseList.asCopOwnerPhoebe(tCopUrl)
      actionCourseList.addExistingCourse(courseName)

      cy.logInTestCase('Category admin: deny request')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.clickTabMenuPending()
      actionCommunitySharing.denyPendingCommunity(tCopName, copOwnerFullName)

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logRequested)
      assertion.verifyFirstCourseChangeLog(logDenied)
    })
  })
})
