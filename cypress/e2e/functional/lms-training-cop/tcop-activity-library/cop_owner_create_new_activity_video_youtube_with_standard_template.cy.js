import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, activityLibrary, activityTitle

    before(() => {
      activityLibraryBase.yaml.getTCopForActivityLibraryCop((data) => {
        cop = data
        activityLibrary = cop.activityLibrary
        activity = activityLibrary.auSCActivityYouTube
        activityTitle = activity.title
      })
    })

    it('CoP Owner creates new activity Video - YouTube with Standard Activity - CoP Library', () => {
      Story.ticket('QA-1593')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copOwnerKristy(cop.admin.url)

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryBase.orgActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryBase.orgActions.createNewVideoActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryBase.orgAssertions.expectToSeeYoutubeThumbnail(activity.youtubeThumbnail)
      activityLibraryBase.orgAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryBase.orgActions.clickBackLinkIcon()
      activityLibraryBase.orgActions.searchActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNewVideoActivityInLibrary(activity)
    })
  })
})
