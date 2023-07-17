import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()

  context(Story.profileContactInfo, () => {
    let profileStatic
    let cambodiaPhone
    let visibilityStatic
    let teamLeaderContactInfo

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        profileStatic = data
        teamLeaderContactInfo = profileStatic.users.teamLeader.contactInfo
        cambodiaPhone = teamLeaderContactInfo.phoneNumbers.personal.cambodia
      })
      profileInfo.stub.getVisibilityStatic((data) => {
        visibilityStatic = data
      })
    })

    beforeEach(() => {
      contactInfo.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader add phone number cambodia', () => {
      Story.ticket('QA-112')
      context('Add new phone number', () => {
        contactInfo.clickEditContactInfo()
        contactInfo.clickAddAnotherPhoneNumber()
        contactInfo.removePhoneNumber(cambodiaPhone.number)
        contactInfo.inputPhoneNumber(cambodiaPhone.label, cambodiaPhone.number)
      })
      context('Change phone number type and visibility', () => {
        cy.get(`@phoneNumber`).within(($phoneNumber) => {
          contactInfo.getSelectType($phoneNumber).then(() => {
            contactInfo.clickSiblingDropdownVisibility(cambodiaPhone.type)
          })
          contactInfo.getSelectVisibility($phoneNumber).then(() => {
            contactInfo.clickSiblingDropdownVisibility(visibilityStatic.organization.label)
          })
        })
      })
      context('Click update and verify himself', () => {
        contactInfo.clickUpdateContactInfoButton()
        contactInfo.expectedShowSuccessUpdateToast()
        contactInfo.goBackToProfileInfo()
        profileInfo.expectedShowPhoneNumber(cambodiaPhone)
      })
      context('View profile as org admin', () => {
        SignInAs.orgAdmin()
        profileInfo.viewOtherUserProfileFromSearch(teamLeaderContactInfo)
        profileInfo.expectedShowPhoneNumber(cambodiaPhone)
      })
      context('View profile as cw normal user', () => {
        SignInAs.ciMember()
        profileInfo.viewOtherUserProfileFromSearch(teamLeaderContactInfo)
        profileInfo.expectedNotShowPhoneNumber(cambodiaPhone)
      })
    })
  })
})
