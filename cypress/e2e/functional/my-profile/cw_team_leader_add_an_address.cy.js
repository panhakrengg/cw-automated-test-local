import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  context(Story.profileContactInfo, () => {
    let addresses
    let germanyAddress
    let indiaAddress
    let teamLeader
    let teamLeaderAddress

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader.contactInfo
        teamLeaderAddress = teamLeader.addresses.fieldSideAddress
      })

      profileInfo.stub.getSampleEditAddress((data) => {
        addresses = data.addresses
        germanyAddress = addresses.germany
        indiaAddress = addresses.india
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader add an address', () => {
      Story.ticket('QA-114')
      context('Add new address', () => {
        contactInfo.clickEditContactInfo()
        contactInfo.removeTheLastAddress()
        contactInfo.clickAddAnotherAddress()
        contactInfo.inputNewAddress(germanyAddress)
        contactInfo.clickAddAnotherAddress()
        contactInfo.inputNewAddress(indiaAddress, 1)
        contactInfo.clickUpdateContactInfo()
        contactInfo.goBackToProfileInfo()
        profileInfo.expectedShowAddress(teamLeaderAddress)
      })
      context('Verify with freemium user', () => {
        SignInAs.freemiumUser()
        profileInfo.viewOtherUserProfileFromSearch(teamLeader)
        profileInfo.expectedShowAddress(teamLeaderAddress)
      })
      context('Verify with org member', () => {
        SignInAs.orgMember()
        profileInfo.viewOtherUserProfileFromSearch(teamLeader)
        profileInfo.expectedShowAddress(teamLeaderAddress)
      })
      context('Reset data', () => {
        contactInfo.login.toProfilePageAsTeamLeader()
        contactInfo.clickEditContactInfo()
        contactInfo.removeTheLastAddress()
        contactInfo.clickUpdateContactInfo()
      })
    })
  })
})
