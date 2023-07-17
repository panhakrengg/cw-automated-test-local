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
      activitiesLibraryYamlStub.getSOActivityFileUnarchive((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    it('Org admin unarchive Activity (file) - Org Library', () => {
      Story.ticket('QA-1873')

      SignInAs.orgAdmin_Amy()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: archive course activity')
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryActions.clickThreeDotArchiveActivityIfExist(activityTitle)

      cy.logInTestCase('Unarchive course activity')
      activityLibraryActions.clickDropdownFilterArchivedAndSearchActivity(activityTitle)
      activityLibraryActions.clickThreeDotUnArchiveActivityIfExist(activityTitle)
      activityLibraryAssertions.expectToSeeNoResultFound()

      cy.logInTestCase('Verify un-archived activity show in activity library')
      activityLibraryActions.clickDropdownFilterActivityLibraryAndSearchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeFileActivityInLibrary(activity)
    })
  })
})
