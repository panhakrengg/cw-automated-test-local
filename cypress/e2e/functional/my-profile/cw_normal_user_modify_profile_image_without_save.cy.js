import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profilePicture, () => {
    beforeEach(() => {
      profileInfo.login.toProfilePageAsCiMember()
    })

    it('Cw Normal User modify profile image without save', () => {
      Story.ticket('QA-43')
      profileInfo.getProfileImageTokenId().then(($imageId) => {
        profileInfo.clickOpenEditProfileImagePopup()
        profileInfo.selectFileUpload(profileInfo._myProfileImagePath)
        profileInfo.clickDeleteProfileImage()
        cy.closeSwal2()
        cy.reload()

        context('Verify with cw normal user still see the same image', () => {
          profileInfo.checkProfileImageTokenId($imageId)
        })
      })
    })
  })
})
