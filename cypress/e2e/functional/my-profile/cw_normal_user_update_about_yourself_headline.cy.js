import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  context(Story.profileContactInfo, () => {
    let cwNormalUser
    let aboutMe

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        cwNormalUser = data.users.cwNormalUser
        aboutMe = cwNormalUser.contactInfo.aboutMe
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsNormalUser()
    })

    it('Cw Normal User update "About Yourself" headline', () => {
      Story.ticket('QA-110')
      context('Update about yourself headline', () => {
        contactInfo.clickEditContactInfo()
        contactInfo.updateAboutYourselfHeadline(aboutMe)
        contactInfo.expectedUpdateButtonDisabled()
        contactInfo.expectedShowSuccessUpdateToast()
        contactInfo.goBackToProfileInfo()
        profileInfo.checkProfileHeadline(aboutMe)
        profileInfo.visitCwDashboard()
        profileInfo.expectedShowProfileHeadline(aboutMe)
      })
    })
  })
})
