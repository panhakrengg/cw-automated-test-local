import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCommunityShareBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
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

  let courseName, courseId, instancesToShared
  let tCopName, tCopUrl
  let copOwnerFullName, categoryAdminFullName, logRequested, logApproved

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getTCopFuncRequestToUseSharedCourse((tCop) => {
        tCopName = tCop.name
        tCopUrl = tCop.url
      })

      yaml.getRequestThenApproveSpecificInstances((course) => {
        courseName = course.name
        courseId = yaml.getUrlId(course)
        instancesToShared = course.communitySharing.instancesToShared
      })

      cy.getUserInfoByRole(copOwner).then((user) => (copOwnerFullName = user.fullName))
      cy.getUserInfoByRole(categoryAdmin).then((user) => (categoryAdminFullName = user.fullName))
    })

    it('Category admin view Change Log after Cop owner Request to Use share course and Category admin Approve specific instances', () => {
      Story.ticket('QA-2225')

      logRequested = `${copOwnerFullName} requested to use course ${courseName} in ${tCopName} community.`
      logApproved = `${categoryAdminFullName} approved a request to use course ${courseName} in ${tCopName}.`

      cy.logInTestCase('Reset Data: Remove communities')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.resetToRemoveCommunity(tCopName)

      cy.logInTestCase('Cop owner: Add Existing Course')
      loginCourseList.asCopOwnerPhoebe(tCopUrl)
      actionCourseList.addExistingCourse(courseName)

      cy.logInTestCase('Category admin: approve request')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.clickTabMenuPending()
      actionCommunitySharing.approveCommunityWithSpecificInstances(
        tCopName,
        copOwnerFullName,
        instancesToShared
      )

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstCourseChangeLog(logRequested)
      assertion.verifyFirstSharedCourseChangeLog(logApproved, instancesToShared, () => {
        assertion.expectToSeeDetailForSharedInstances(instancesToShared)
      })
    })
  })
})
