import Epic from '../../../../../classes/Epic'
import Story from '../../../../../classes/Story'
import ChangeLogActivityLibraryBase from '../../../../../classes/lms-admin/settings/change-log/ChangeLogActivityLibraryBase'
import SignInAs from '../../../../../classes/utilities/SignInAs'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.LmsAdmin, () => {
  const { activityAction, activityAssertion, yaml, assertion, login, action } =
    new ChangeLogActivityLibraryBase()
  let activity, activityTitle, changeLog

  context(Story.lmsChangeLogActivityLibrary, () => {
    const userRole = UserRole.ORG_ADMIN.ORG_ADMIN_AMY
    before(() => {
      yaml.getAuSOActivityFileDeleteLog((data) => {
        activity = data
        activityTitle = activity.title
      })

      cy.getUserInfoByRole(userRole).then((user) => {
        changeLog = `${user.fullName} deleted an activity from the activity library.`
      })
    })

    it('Org admin view Change Log after Delete File activity', () => {
      Story.ticket('QA-1971')

      SignInAs.orgAdmin_Amy()
      activityAction.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Activity Exist In The List')
      activityAction.createNewActivityIfNotExist(activityTitle, () => {
        activityAction.createNewFileActivity(activity)
        activityAssertion.verifyActivityInfoWithStandardTemplateInEditMode(activity)
        activityAction.clickBackLinkIcon()
      })

      cy.logInTestCase('Delete Activity')
      activityAction.searchActivity(activityTitle)
      activityAction.clickThreeDotDeleteActivity(activityTitle)
      activityAssertion.expectToSeeNoResultFound()

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
