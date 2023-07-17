import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profilePicture, () => {
    let myProfileImage1

    before(() => {
      profileInfo.stub.getProfileImageCanvas((data) => {
        myProfileImage1 = data.css.transform.myProfileImage1
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsInstanceMember()
    })

    it('Cw Normal User able to see edit image popup', () => {
      Story.ticket('QA-44')
      profileInfo.verifyEditYourImagePopup(myProfileImage1)
    })

    it('Cw Normal User able to see edit image popup in contact info', () => {
      Story.ticket('QA-804')
      profileInfo.clickEditContactInfo()
      profileInfo.verifyEditYourImagePopup(myProfileImage1)
    })
  })
})
