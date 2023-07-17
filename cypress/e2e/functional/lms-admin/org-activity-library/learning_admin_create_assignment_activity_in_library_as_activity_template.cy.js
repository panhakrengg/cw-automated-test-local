import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()

  context(Story.organizationActivityLibrary, { tags: ['@skipFeatureChange'] }, () => {
    let activity
    let activityTitle

    before(() => {
      activitiesLibraryYamlStub.getAuTOActivityAssignment((data) => {
        activity = data
        activity.title = activity.assignmentName
        activityTitle = activity.title
      })
    })

    it('[Org LIBRARY] Org admin create activity with content type as Assignment (Activity Template only)', () => {
      Story.ticket('QA-1904')

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewAssignmentActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.verifyMoodleActivityWithActivityTemplate(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNewAssignmentActivityInLibrary(activity)
    })
  })
})
