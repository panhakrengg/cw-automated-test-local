import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import Story from '../../../../classes/Story'
import SignInAs from '../../../../classes/utilities/SignInAs'

describe(Epic.LmsAdmin, () => {
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()

  context(Story.organizationActivityLibrary, () => {
    let activity
    let activityTitle

    before(() => {
      activitiesLibraryYamlStub.getSOActivityRichTextDelete((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    it('Org admin delete Activity (rich text) - Org Library', () => {
      Story.ticket('QA-1871')

      SignInAs.orgAdmin_Amy()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Activity Exist In The List')
      activityLibraryActions.createNewActivityIfNotExist(activityTitle, () => {
        activityLibraryActions.createNewRichTextActivity(activity)
        activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)
        activityLibraryActions.clickBackLinkIcon()
      })

      cy.logInTestCase('Delete Activity')
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryActions.clickThreeDotDeleteActivity(activityTitle)

      cy.logInTestCase('Verify Activity Deleted Successfully')
      activityLibraryAssertions.expectToSeeNoResultFound()
    })
  })
})
