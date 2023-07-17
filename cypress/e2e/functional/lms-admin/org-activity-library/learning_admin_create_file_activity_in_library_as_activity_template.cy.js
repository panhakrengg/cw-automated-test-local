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

  context(Story.organizationActivityLibrary, () => {
    let activity

    before(() => {
      activitiesLibraryYamlStub.getAuSOActivityFilePdf((data) => {
        activity = data
      })
    })

    it('[Org LIBRARY] Learning Admin creates activity (file) in Activity Library and chooses Template as Standard', () => {
      Story.ticket('QA-1816')

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activity.title)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewFileActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.expectToSeeFileUploadedSuccessfully(activity.uploadFiles.name)
      activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)
    })
  })
})
