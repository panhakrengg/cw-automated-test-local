import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { activityAction, yaml, assertion, login, action } = new ChangeLogActivityLibraryBase()
  const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY
  let activity, changeLog

  context(Story.lmsChangeLogActivityLibrary, () => {
    before(() => {
      yaml.getAuSOActivityFilePdfLog((data) => {
        activity = data
      })

      cy.getUserInfoByRole(userRole).then((user) => {
        changeLog = `${user.fullName} added an activity to the activity library.`
      })
    })

    it('Learning admin view Change Log after Add new File activity', () => {
      Story.ticket('QA-1969')

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      SignInAs.learningAdminEmery()
      activityAction.visitActivityLibrary()
      activityAction.deleteActivityFromLibraryIfFound(activity.title)

      cy.logInTestCase('Create Activity')
      activityAction.createNewFileActivity(activity)

      cy.logInTestCase('Verify All Log')
      login.learningAdminEmery()
      action.clickLinkChangeLog()
      assertion.expectToSeeChangeLogList()
      assertion.verifyFirstChangeLog(changeLog, activity, () => {
        assertion.expectToSeeDetailForActivity(activity)
      })

      cy.logInTestCase('Verify Change Log Activity Library')
      action.clickDropdownFilterByActivityLibraryChanges()
      assertion.verifyFirstChangeLog(changeLog, activity, () => {
        assertion.expectToSeeDetailForActivity(activity)
      })
    })
  })
})
