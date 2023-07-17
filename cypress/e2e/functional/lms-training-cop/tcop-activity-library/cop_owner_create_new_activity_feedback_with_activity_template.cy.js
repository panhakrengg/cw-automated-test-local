import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, activityTitle

    before(() => {
      activityLibraryBase.yaml.getTCopForActivityLibraryCop((data) => {
        cop = data
        activity = cop.activityLibrary.auTCActivityFeedback
        activity.title = activity.name
        activityTitle = activity.title
      })
    })

    it('CoP Owner creates new activity Feedback with Activity Template - CoP Library', () => {
      Story.ticket('QA-1599')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copOwnerKristy(cop.admin.url)

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryBase.orgActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryBase.orgActions.createNewFeedbackActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryBase.orgAssertions.verifyMoodleActivityWithActivityTemplate(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryBase.orgActions.clickBackLinkIcon()
      activityLibraryBase.orgActions.searchActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNewFeedbackActivityInLibrary(activity)
    })
  })
})
