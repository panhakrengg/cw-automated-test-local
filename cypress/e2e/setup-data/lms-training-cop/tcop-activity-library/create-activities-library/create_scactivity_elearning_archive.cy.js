import Epic from '../../../../../classes/Epic'
import ActivityLibraryItc from '../../../../../classes/lms-admin/base/intercepts/ActivityLibraryItc'
import SetUpActivities from '../../../../../classes/lms/admin/activities-library/SetUpActivities'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.LmsTrainingCop, () => {
  let elearning, copObj, copAdminUrl
  const setupActivityLibrary = new SetUpActivities()

  before(() => {
    cy.stubCommunity(
      'lms-training-cop/tcop-activity-library/tcop-activity-library',
      'tCopForActivityLibrary'
    ).then((stubCommunity) => {
      copObj = stubCommunity
      copAdminUrl = copObj.admin.url
      elearning = copObj.activityLibrary.sCActivityElearningArchive
    })

    setupActivityLibrary.itcSearchActivityLibrary.set()
  })

  context(Story.tCopActivityLibrary, () => {
    it('Setup elearning activity "SCActivity elearning to archive - 4 Slide Only"', () => {
      ActivityLibraryItc.itcSearchActivityLibrary.set()
      SignInAs.copOwner_Kristy(setupActivityLibrary.getActivityLibraryCoPUrl(copAdminUrl))
      ActivityLibraryItc.itcSearchActivityLibrary.wait()
      setupActivityLibrary.createElearning(elearning)
    })
  })
})
