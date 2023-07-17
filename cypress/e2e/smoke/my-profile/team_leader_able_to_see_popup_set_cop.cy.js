import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileCommunityTab, () => {
    it('Team Leader able to see popup set CoP', () => {
      Story.ticket('QA-331')
      SignInAs.teamLeaderRootOrgUnit()
      profileInfo.visitMyProfile()
      profileInfo.clickCommunityTab()
      profileInfo.clickEditMyCommunity()
      profileInfo.expectedPopupShowCoPList()
      profileInfo.expectedSaveButtonStateOnShowInProfileClick()
      profileInfo.expectedSaveButtonEnableOnPrimaryClick()
      profileInfo.expectedUnlistedCoPWarningTextIsVisible()
    })
  })
})
