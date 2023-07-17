import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import { ChangeLogCommunityShareBase } from '../../../../../classes/lms-admin/settings/change-log/ChangeLogCourseBase'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { action, actionCommunitySharing, assertion, loginCommunitySharing, yaml } =
    new ChangeLogCommunityShareBase()
  const categoryAdmin = UserRole.LMS_USERS.CATEGORY_ADMIN.AU_LN_CTG_AD_KENTON

  let courseName, courseId, instancesToShared
  let logEdited

  context(Story.lmsChangeLogCourse, () => {
    before(() => {
      yaml.getDefaultInstanceToSpecific((course) => {
        courseName = course.name
        courseId = yaml.getUrlId(course)
        instancesToShared = course.communitySharing.instancesToShared

        cy.getUserInfoByRole(categoryAdmin).then((user) => {
          logEdited = `${user.fullName} edited Community Sharing settings for course ${courseName}.`
        })
      })
    })

    it('Category admin view Change Log after Edit Default instances to share as Specific course instance', () => {
      Story.ticket('QA-2218')

      cy.logInTestCase('Reset Data: Default instances to share is All course instances')
      loginCommunitySharing.asCategoryAdminKenton(courseId)
      actionCommunitySharing.resetToSelectAllCourseInstances()

      cy.logInTestCase('Category admin: approve request')
      actionCommunitySharing.setDefaultInstancesAsSpecificInstances(instancesToShared)

      cy.logInTestCase('Verify change log in Course')
      action.clickLinkChangeLogInCourse()
      assertion.verifyFirstEditDefaultInstanceToShareChangeLog(logEdited, true, () => {
        assertion.expectToSeeDetailForEditCommunityShare(instancesToShared, true)
      })
    })
  })
})
