import Epic from '../../../../../classes/Epic'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let assignment, copObj, copAdminUrl
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    cy.stubCommunity(
      'lms-training-cop/tcop-activity-library/tcop-activity-library',
      'tCopForActivityLibrary'
    ).then((stubCommunity) => {
      copObj = stubCommunity
      copAdminUrl = copObj.admin.url
      assignment = copObj.activityLibrary.tCActivityAssignmentEditPrevious
    })

    setupActivityLibrary.itcSearchActivityLibrary.set()
  })

  context(Story.tCopActivityLibrary, () => {
    it('Setup assignment activity "TCActivity Assignment for editing"', () => {
      SignInAs.copOwner_Kristy(setupActivityLibrary.getActivityLibraryCoPUrl(copAdminUrl))
      setupActivityLibrary.createAssignment(assignment)
    })
  })
})
