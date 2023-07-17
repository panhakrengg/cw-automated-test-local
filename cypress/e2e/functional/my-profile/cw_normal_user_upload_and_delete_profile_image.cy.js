import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, { retries: 1 }, () => {
  const profileInfo = new ProfileInfo()
  context(Story.profilePicture, () => {
    let defaultImage
    let myProfileImage
    let myProfileImage1

    before(() => {
      profileInfo.stub.getProfileImageCanvas((imageData) => {
        let data = imageData.css.transform
        defaultImage = data.defaultImage
        myProfileImage = data.myProfileImage
        myProfileImage1 = data.myProfileImage1
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsCiMember()
    })

    it('Cw Normal User upload and delete profile image', () => {
      Story.ticket('QA-45')
      profileInfo.getProfileImageId().then(($imageId) => {
        context('Update new profile image', () => {
          profileInfo.itcGetProfileImage.set()
          profileInfo.clickOpenEditProfileImagePopup()
          profileInfo.clickDeleteProfileImage()
          profileInfo.selectFileUpload(profileInfo._myProfileImage1Path)
          profileInfo.expectedMyProfileShowAfterUpload(myProfileImage1.original[0])
          profileInfo.clickSaveProfileImage()
          profileInfo.itcGetProfileImage.wait()
          context('Verify with cw normal user still see the update image', () => {
            profileInfo.checkProfileImageIsUpdated($imageId)
            profileInfo.checkGlobalProfileImageIsUpdated($imageId)
          })
        })

        context('Delete my profile image', () => {
          profileInfo.itcGetProfileImage.set()
          profileInfo.clickOpenEditProfileImagePopup()
          profileInfo.clickDeleteProfileImage()
          profileInfo.expectedMyProfileShowAfterUpload(defaultImage.original)
          profileInfo.clickSaveProfileImage()
          profileInfo.itcGetProfileImage.wait()
          context('Verify with cw normal user still see the default image', () => {
            profileInfo.checkProfileImageIsUpdated($imageId)
            profileInfo.checkGlobalProfileImageIsUpdated($imageId)
          })
        })

        context('Reset Data', () => {
          profileInfo.itcGetProfileImage.set()
          profileInfo.clickOpenEditProfileImagePopup()
          profileInfo.selectFileUpload(profileInfo._myProfileImagePath)
          profileInfo.expectedMyProfileShowAfterUpload(myProfileImage.original)
          profileInfo.clickSaveProfileImage()
          profileInfo.itcGetProfileImage.wait()
          context('Verify with cw normal user still see the update image', () => {
            profileInfo.checkProfileImageIsUpdated($imageId)
            profileInfo.checkGlobalProfileImageIsUpdated($imageId)
          })
        })
      })
    })
  })
})
