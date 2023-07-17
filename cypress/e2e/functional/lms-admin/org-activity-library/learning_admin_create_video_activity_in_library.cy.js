import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import ReportDefect from '../../../../classes/utilities/ReportDefect'
import SignInLmsAs from '../../../../classes/utilities/sign-in/SignInLmsAs'

describe(Epic.LmsAdmin, () => {
  const signInLmsAs = new SignInLmsAs()
  const activitiesLibraryYamlStub = new ActivitiesLibraryYamlStub()
  const activityLibraryActions = new ActivityLibraryActions()
  const activityLibraryAssertions = new ActivityLibraryAssertions()

  context(Story.organizationActivityLibrary, () => {
    let activity
    let activityTitle

    before(() => {
      activitiesLibraryYamlStub.getAuSOActivityVideoFile((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    after(() => {
      ReportDefect.markCwDefect('CW-17617: Upload file problem when File name has special characters')
    })

    it('[Org LIBRARY] Learning admin create activity with content type as Video', () => {
      Story.ticket('QA-1895', ['CW-17617'])

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewVideoActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.expectToSeeFileUploadedSuccessfully(activity.uploadVideoFile.name)
      activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNewVideoActivityInLibrary(activity)
    })
  })
})
