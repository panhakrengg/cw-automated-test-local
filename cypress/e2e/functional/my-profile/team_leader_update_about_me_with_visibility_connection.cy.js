import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let teamLeader
    let aboutMe
    let contactInfo

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader
        contactInfo = teamLeader.contactInfo
        aboutMe = teamLeader.aboutMe
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader update About me with visibility Connection', () => {
      Story.ticket('QA-803')
      context('Update about me', () => {
        profileInfo.clickCommunityTab()
        profileInfo.clickEditAboutMe()
        profileInfo.updateAboutMe()
        profileInfo.clickEditAboutMe()
        profileInfo.updateAboutMe(aboutMe)
        profileInfo.expectedShowAboutMe(aboutMe)
      })

      context('Verify as cw normal user', () => {
        SignInAs.courseInstanceMember()
        profileInfo.viewOtherUserProfileFromSearch(contactInfo)
        profileInfo.clickCommunityTab()
        profileInfo.expectedShowAboutMe(aboutMe)
      })

      context('Verify as freemium user', () => {
        SignInAs.freemiumUser()
        profileInfo.viewOtherUserProfileFromSearch(contactInfo)
        profileInfo.clickCommunityTab()
        profileInfo.expectShowEmptyState(contactInfo.screenName)
      })
    })
  })
})
