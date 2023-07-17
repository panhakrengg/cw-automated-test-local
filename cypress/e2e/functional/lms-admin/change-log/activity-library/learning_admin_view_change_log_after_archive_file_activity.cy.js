import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, () => {
  const { activityAction, yaml, assertion, action } = new ChangeLogActivityLibraryBase()
  let activity, activityTitle, changeLog

  context(Story.lmsChangeLogActivityLibrary, () => {
    const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY
    before(() => {
      yaml.getSOActivityFileArchiveLog((data) => {
        activity = data
        activityTitle = data.title
      })

      cy.getUserInfoByRole(userRole).then((user) => {
        changeLog = `${user.fullName} archived an activity in the activity library.`
      })
    })

    it('Learning admin view Change Log after Archive File activity', () => {
      Story.ticket('QA-1972')

      SignInAs.learningAdminEmery()
      activityAction.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Unarchive course activity')
      activityAction.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityAction.clickThreeDotUnArchiveActivityIfExist(activityTitle)

      cy.logInTestCase('Archive course activity')
      activityAction.clickDropdownFilterActivityLibraryAndSearchActivity(activityTitle)
      activityAction.clickThreeDotArchiveActivity(activityTitle)

      cy.logInTestCase('Verify All Log')
      action.visitLearningSetting()
      action.clickLinkChangeLog()
      assertion.expectToSeeChangeLogList()
      assertion.verifyFirstChangeLog(changeLog, activity)

      cy.logInTestCase('Verify Change Log Activity Library')
      action.clickDropdownFilterByActivityLibraryChanges()
      assertion.verifyFirstChangeLog(changeLog, activity)
    })
  })
})
