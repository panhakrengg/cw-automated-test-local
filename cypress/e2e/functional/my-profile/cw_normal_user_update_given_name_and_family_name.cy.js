import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  context(Story.profileContactInfo, () => {
    let cwNormalUser

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        cwNormalUser = data.users.cwNormalUser
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsNormalUser()
    })

    it('Cw Normal User update field given name and family name', () => {
      Story.ticket('QA-108')
      context('Verify disable button when no data', () => {
        contactInfo.clickEditContactInfo()
        contactInfo.clearProfile()
        contactInfo.expectedUpdateButtonDisabled()
      })
      context('Update user profile(given name and family name)', () => {
        const user = contactInfo.updateProfile(cwNormalUser.contactInfo, true)
        contactInfo.clickUpdateContactInfoButton()
        contactInfo.expectedUpdateButtonDisabled()
        contactInfo.expectedShowSuccessUpdateToast()

        context('Verify user name in my profile', () => {
          contactInfo.goBackToProfileInfo()
          profileInfo.expectedShowProfileUsername(user.profileUserName)
        })

        context('Verify user name in cw dashboard', () => {
          profileInfo.visitCwDashboard()
          profileInfo.expectedShowProfileUsernameInDashboard(user.fullName)
        })
      })

      context('Reset Data', () => {
        contactInfo.visitMyProfile()
        contactInfo.clickEditContactInfo()
        contactInfo.clearProfile()
        contactInfo.updateProfile(cwNormalUser.contactInfo)
        contactInfo.clickUpdateContactInfoButton()
        contactInfo.expectedUpdateButtonDisabled()
        contactInfo.expectedShowSuccessUpdateToast()
      })
    })
  })
})
