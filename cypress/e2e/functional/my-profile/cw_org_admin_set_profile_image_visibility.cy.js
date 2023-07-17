import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import MyProfileLoginStub from '../../../classes/my-profile/stub/MyProfileLoginStub'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let screenName

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        screenName = data.users.orgAdmin.contactInfo.screenName
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsOrgAdmin()
    })

    it('Org Admin set profile image visibility as "Organization"', () => {
      context('Update profile image visibility', () => {
        profileInfo.setMyProfileImageVisibility('Organization')
      })
      profileInfo.getProfileImageTokenId().then(($imageId) => {
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
          profileInfo.checkProfileImageTokenId($imageId)
        })

        context('Verify view image profile with cw normal user', () => {
          SignInAs.courseInstanceMember()
          profileInfo.verifyMyProfileWithDefaultImage(screenName)
        })

        context('Verify view image profile with org member', () => {
          SignInAs.orgMember()
          profileInfo.verifyMyProfileImage(screenName, $imageId)
        })

        context('Verify view image profile with freemium user', () => {
          SignInAs.freemiumUser()
          profileInfo.verifyMyProfileWithDefaultImage(screenName)
        })
      })
    })
  })
})
