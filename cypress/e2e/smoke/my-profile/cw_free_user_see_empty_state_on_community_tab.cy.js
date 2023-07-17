import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let emptyStateStatic

    before(() => {
      profileInfo.stub.getEmptyStateStatic((data) => {
        emptyStateStatic = data
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsFreeUser()
    })

    it('Cw Free User see empty stage on community tab', () => {
      Story.ticket('QA-367')
      profileInfo.clickCommunityTab()
      profileInfo.expectedShowAboutMeEmptyState(emptyStateStatic.community.aboutMe)
      profileInfo.expectedShowMyPrimaryCommunityEmptyState(
        emptyStateStatic.community.myPrimaryCommunity
      )
      profileInfo.expectedShowMyOtherCommunityEmptyState(
        emptyStateStatic.community.myOtherCommunity
      )
      profileInfo.clickExpertiseAndQualificationTab(false)
      profileInfo.expectedShowMyFocusEmptyState(emptyStateStatic.expertise.myFocus)
    })
  })
})
