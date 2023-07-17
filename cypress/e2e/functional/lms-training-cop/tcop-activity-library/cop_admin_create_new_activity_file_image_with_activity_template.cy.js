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
        activity = cop.activityLibrary.auTCActivityFileImage
        activityTitle = activity.title
      })
    })

    it('CoP Admin creates new activity File - Image with Activity Template - CoP Library', () => {
      Story.ticket('QA-1605')

      cy.logInTestCase('Login and visit TCop admin activity library')
      activityLibraryBase.login.copAdminBettye(cop.admin.url)

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryBase.orgActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryBase.orgActions.createNewFileActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryBase.orgAssertions.expectToSeeFileUploadedSuccessfully(
        activity.uploadFiles.name
      )
      activityLibraryBase.orgAssertions.verifyActivityInfoWithActivityTemplateInEditMode(activity)
    })
  })
})
