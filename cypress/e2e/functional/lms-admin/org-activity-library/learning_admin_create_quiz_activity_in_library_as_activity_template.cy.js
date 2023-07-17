import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import Story from '../../../../classes/Story'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, { tags: ['@skipFeatureChange'] }, () => {
  const signInLmsAs = new SignInLmsAs()
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()

  context(Story.organizationActivityLibrary, () => {
    let activity
    let activityTitle

    before(() => {
      activitiesLibraryYamlStub.getAuTOActivityQuiz((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    it('[Org LIBRARY] Org admin create activity with content type as Quiz (Activity Template only)', () => {
      Story.ticket('QA-1903')

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewQuizActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.verifyMoodleActivityWithActivityTemplate(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNewQuizActivityInLibrary(activity)
    })
  })
})
