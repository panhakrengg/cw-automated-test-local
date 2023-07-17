import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import TCopActivityLibraryBase from '../../../../classes/lms-training-cop/admin/activity-library/TCopActivityLibraryBase'

describe(Epic.LmsTrainingCop, { retries: 1 }, () => {
  const activityLibraryBase = new TCopActivityLibraryBase()

  context(Story.tCopActivityLibrary, () => {
    let cop, activity, activityTitle

    before(() => {
      activityLibraryBase.yaml.getTCopForActivityLibraryCop((data) => {
        cop = data
        activity = cop.activityLibrary.auTCActivityVideoFile
        activityTitle = activity.title
      })
    })

    it('CoP Owner creates new activity Video - Upload File with Activity Template - CoP Library', () => {
      Story.ticket('QA-1606')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copOwnerKristy(cop.admin.url)

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryBase.orgActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryBase.orgActions.createNewVideoActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryBase.orgAssertions.expectToSeeFileUploadedSuccessfully(
        activity.uploadVideoFile.name
      )
      activityLibraryBase.orgAssertions.verifyActivityInfoWithActivityTemplateInEditMode(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryBase.orgActions.clickBackLinkIcon()
      activityLibraryBase.orgActions.searchActivity(activityTitle)
      activityLibraryBase.orgAssertions.expectToSeeNewVideoActivityInLibrary(activity, false)
    })
  })
})
