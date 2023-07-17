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
      activitiesLibraryYamlStub.getAuSOActivityFileImage((data) => {
        activity = data
      })
    })

    it('[Org LIBRARY] Learning admin create activity with content type as File', () => {
      Story.ticket('QA-1896')

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activity.title)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewFileActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.expectToSeeFileUploadedSuccessfully(activity.uploadFiles.name)
      activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)

      cy.logInTestCase('Verify New Activity In Activity List')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(activity.title)
      activityLibraryAssertions.expectToSeeFileActivityInLibrary(activity)
    })
  })
})
