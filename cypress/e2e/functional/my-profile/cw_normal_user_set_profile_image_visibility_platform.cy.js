import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let normalUserScreenName

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        normalUserScreenName = data.users.normal.contactInfo.screenName
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsCiMember()
    })

    it('Cw Normal User change profile image and set visibility as "Platform"', () => {
      context('Update profile image visibility', () => {
        profileInfo.clickOpenEditProfileImagePopup()
        profileInfo.clickDeleteProfileImage()
        profileInfo.selectFileUpload(profileInfo._myProfileImagePath)
        profileInfo.selectProfileImageVisibility('Platform')
        profileInfo.clickSaveProfileImage()
      })
      profileInfo.getProfileImageTokenId().then(($imageId) => {
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.checkProfileImageTokenId($imageId)

        context('Verify view image profile with freemium user', () => {
          SignInAs.freemiumUser()
          profileInfo.verifyMyProfileImage(normalUserScreenName, $imageId)
        })

        context('Verify view image profile with org admin', () => {
          SignInAs.orgAdmin()
          profileInfo.verifyMyProfileImage(normalUserScreenName, $imageId)
        })
      })
    })
  })
})
