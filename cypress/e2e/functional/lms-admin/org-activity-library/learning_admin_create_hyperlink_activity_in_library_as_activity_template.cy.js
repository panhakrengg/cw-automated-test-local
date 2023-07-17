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
      activitiesLibraryYamlStub.getAuTOActivityHyperlinkCw((data) => {
        activity = data
      })
    })

    it('[Org LIBRARY] Learning admin create activity (hyperlink) in Activity Library and choose Template as Activity Template', () => {
      Story.ticket('QA-1817')

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activity.displayText)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewHyperLinkActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.verifyActivityInfoWithActivityTemplateInEditMode(activity)
    })
  })
})
