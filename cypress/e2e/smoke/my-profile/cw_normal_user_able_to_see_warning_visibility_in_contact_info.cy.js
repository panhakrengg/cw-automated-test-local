import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import MyProfileLoginStub from '../../../classes/my-profile/stub/MyProfileLoginStub'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()

  context(Story.profileContactInfo, () => {
    let warningMessage

    before(() => {
      contactInfo.stub.getProfileStatic((profileStatic) => {
        warningMessage = profileStatic.Details.warningMessage
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsNormalUser()
    })

    it('Cw Normal able to see warning visibility settings on Contact info', () => {
      Story.ticket('QA-312')
      contactInfo.clickEditContactInfo()
      contactInfo.checkVisibilityWarningMessage(warningMessage)
    })
  })
})
