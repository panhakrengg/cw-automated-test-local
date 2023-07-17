import Epic from '../../../../classes/Epic'
import ActivityLibraryActions from '../../../../classes/lms-admin/base/actions/ActivityLibraryActions'
import ActivityLibraryAssertions from '../../../../classes/lms-admin/base/assertions/ActivityLibraryAssertions'
import ActivitiesLibraryYamlStub from '../../../../classes/lms-admin/base/stub/ActivitiesLibraryYamlStub'
import Story from '../../../../classes/Story'
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
      activitiesLibraryYamlStub.getAuSOActivityElearning((data) => {
        activity = data
        activityTitle = activity.title
      })
    })

    after(() => {
      ReportDefect.markCwDefect('Slow performance for create elearning activity')
    })

    it('[Org LIBRARY] Learning admin create Interactive eLearning in Activity Library (Standard Activity)', () => {
      Story.ticket('QA-1815', ['CW-17406'])

      signInLmsAs.lnAdmin_Emery()
      activityLibraryActions.visitActivityLibrary()

      cy.logInTestCase('Reset Data: Remove Existing Activity')
      activityLibraryActions.deleteActivityFromLibraryIfFound(activityTitle)

      cy.logInTestCase('Create Activity')
      activityLibraryActions.createNewELearningActivity(activity)

      cy.logInTestCase('Verify Created Activity')
      activityLibraryAssertions.expectToSeeFileUploadedSuccessfully(activity.uploadFiles.name)
      activityLibraryAssertions.verifyActivityInfoWithStandardTemplateInEditMode(activity)

      cy.logInTestCase('Verify Activity In Activity List')
      activityLibraryActions.clickBackLinkIcon()
      activityLibraryActions.searchActivity(activityTitle)
      activityLibraryAssertions.expectToSeeNewELearningActivityInLibrary(activity)
    })
  })
})
