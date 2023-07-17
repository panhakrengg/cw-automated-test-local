import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import LmsUserRole from '../../../../../classes/utilities/user-role/LmsUserRole'

describe(Epic.LmsAdmin, { retries: 1 }, () => {
  const { activityAction, yaml, assertion, login, action } = new ChangeLogActivityLibraryBase()
  let oldActivity, newActivity, changeLog

  context(Story.lmsChangeLogActivityLibrary, () => {
    const userRole = LmsUserRole.LMS_USERS.LEARNING_ADMIN.AU_LN_ADMIN_EMERY
    before(() => {
      yaml.getEditFileActivityLibrary((data) => {
        oldActivity = data.previous
        newActivity = data.new
      })

      cy.getUserInfoByRole(userRole).then((user) => {
        changeLog = `${user.fullName} edited an activity in the activity library.`
      })
    })

    it('Learning admin view Change Log after Edit File activity', () => {
      Story.ticket('QA-1970')

      SignInAs.learningAdminEmery()
      activityAction.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Update Activity To Original Data')
      activityAction.editActivityIfExist(newActivity.title, oldActivity)

      cy.logInTestCase('Edit Activity')
      activityAction.editActivity(newActivity, oldActivity.title)

      cy.logInTestCase('Verify All Log')
      login.learningAdminEmery()
      action.clickLinkChangeLog()
      assertion.expectToSeeChangeLogList()
      assertion.verifyFirstChangeLog(changeLog, newActivity, () => {
        assertion.expectToSeeDetailForEditActivity(oldActivity, newActivity)
      })

      cy.logInTestCase('Verify Change Log Activity Library')
      action.clickDropdownFilterByActivityLibraryChanges()
      assertion.verifyFirstChangeLog(changeLog, newActivity, () => {
        assertion.expectToSeeDetailForEditActivity(oldActivity, newActivity)
      })
    })
  })
})
