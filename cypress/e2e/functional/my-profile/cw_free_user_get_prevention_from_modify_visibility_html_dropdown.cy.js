import Epic from '../../../classes/Epic'
import ContactInfo from '../../../classes/my-profile/ContactInfo'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const contactInfo = new ContactInfo()
  const profileInfo = new ProfileInfo()
  context(Story.profileVisibility, () => {
    let emails

    before(() => {
      contactInfo.stub.getProfileStatic((data) => {
        emails = data.users.freemium.contactInfo.emails
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsFreeUser()
    })

    it('Cw Free User get prevention from modify visibility html drop-down', () => {
      Story.ticket('QA-759')
      contactInfo.clickEditContactInfo()
      contactInfo.checkAccountEmailFreemiumUserVisibility()
      cy.get('@dropdownVisibility').within(() => {
        contactInfo.removeDisabledFromHtmlForDropdownVisibility()
        contactInfo.checkDropdownItemsEnabled(['Network'])
        contactInfo.verifySelectedDropdownVisibilityItem('Network')
      })
      contactInfo.clickUpdateContactInfoButton()

      context('Verify preview as any logged-in user', () => {
        contactInfo.goBackToProfileInfo()
        profileInfo.previewProfileAsAnyLoggedInUser()
        profileInfo.expectedNotShowEmails(emails.preferred.type, emails.preferred.emails[0])
      })
    })
  })
})
