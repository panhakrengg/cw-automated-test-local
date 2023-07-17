import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 1 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let screenName

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        screenName = data.users.teamLeader.contactInfo.screenName
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader set profile image visibility as "Network"', () => {
      context('Update profile image visibility', () => {
        profileInfo.setMyProfileImageVisibility('Network')
      })
      profileInfo.getProfileImageTokenId().then(($imageId) => {
        context('Preview As Someone in any logged in user', () => {
          profileInfo.previewProfileAsAnyLoggedInUser()
          profileInfo.checkDefaultProfileImageVisible()
        })

        context('Preview As Someone in connections', () => {
          profileInfo.visitMyProfile()
          profileInfo.previewProfileAsConnections()
          profileInfo.checkProfileImageTokenId($imageId)
        })

        context('Preview As Someone in organization', () => {
          profileInfo.visitMyProfile()
          profileInfo.previewProfileAsOrganization()
          profileInfo.checkProfileImageTokenId($imageId)
        })

        context('Verify view image profile with org admin', () => {
          SignInAs.orgAdmin()
          profileInfo.verifyMyProfileImage(screenName, $imageId, 'Message')
        })

        context('Verify view image profile with cw normal member', () => {
          SignInAs.ciMember()
          profileInfo.verifyMyProfileImage(screenName, $imageId, 'Message')
        })

        context('Verify view image profile with freemium user', () => {
          SignInAs.freemiumUser()
          profileInfo.verifyMyProfileWithDefaultImage(screenName)
        })
      })
    })

    it('Team Leader set profile image visibility as "Only Me"', () => {
      context('Update profile image visibility', () => {
        profileInfo.setMyProfileImageVisibility('Only Me')
      })
      profileInfo.getProfileImageId().then(($imageId) => {
        context('Preview As Someone in any logged in user', () => {
          profileInfo.previewProfileAsAnyLoggedInUser()
          profileInfo.checkDefaultProfileImageVisible()
        })

        context('Preview As Someone in connections', () => {
          profileInfo.visitMyProfile()
          profileInfo.previewProfileAsConnections()
          profileInfo.checkDefaultProfileImageVisible()
        })

        context('Preview As Someone in organization', () => {
          profileInfo.visitMyProfile()
          profileInfo.previewProfileAsOrganization()
          profileInfo.checkDefaultProfileImageVisible()
        })

        context('Verify view image profile with org admin', () => {
          SignInAs.orgAdmin()
          profileInfo.verifyMyProfileWithDefaultImage(screenName, 'Message')
        })

        context('Verify view image profile with freemium user', () => {
          SignInAs.freemiumUser()
          profileInfo.verifyMyProfileWithDefaultImage(screenName)
        })
      })
    })
  })
})
