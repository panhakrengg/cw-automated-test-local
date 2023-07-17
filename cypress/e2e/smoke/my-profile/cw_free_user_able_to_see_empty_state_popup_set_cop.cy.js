import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileCommunityTab, () => {
    it('Cw Free User able to see empty state popup set CoP', () => {
      Story.ticket('QA-811')
      SignInAs.freemiumUser()
      profileInfo.visitMyProfile()
      profileInfo.clickEditMyCommunity()
      profileInfo.expectedEmptyStateImageAndText()
    })
  })
})
