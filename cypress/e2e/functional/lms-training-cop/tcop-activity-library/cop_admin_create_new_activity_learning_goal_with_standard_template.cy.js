import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, { tags: ['@skipFeatureChange'] }, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, activityTitle

    before(() => {
      activityLibraryBase.yaml.getTCopForActivityLibraryCop((data) => {
        cop = data
        activity = cop.activityLibrary.auSCActivityLearningGoal
        activityTitle = activity.title
      })
    })

    it('CoP Admin creates new activity Learning Goal - CoP Library', () => {
      Story.ticket('QA-1597')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copAdminBettye(cop.admin.url)

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryBase.orgActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryBase.orgActions.createNewLearningGoalActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryBase.orgAssertions.expectToSeeFileUploadedSuccessfully(
        activity.uploadFiles.name
      )
      activityLibraryBase.orgAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryBase.orgActions.clickBackLinkIcon()
      activityLibraryBase.orgActions.searchActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNewLearningGoalActivityInLibrary(activity)
    })
  })
})
