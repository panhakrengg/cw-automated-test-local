import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileInfo = new ProfileInfo()

  context(Story.profileVisibility, () => {
    let orgAdmin
    let expertiseQualifications
    let details

    before(() => {
      profileInfo.stub.getProfileStatic((profileStatic) => {
        orgAdmin = profileStatic.users.orgAdmin
        expertiseQualifications = orgAdmin.expertiseQualifications
        details = orgAdmin.details
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsOrgAdmin()
    })

    it('Org Member able to see Org Admin profile and has no connection', () => {
      profileInfo.getProfileImageTokenId().then(($imageId) => {
        context('verify org admin profile by org member', () => {
          SignInAs.orgMember()
          profileInfo.verifyMyProfileImage(orgAdmin.contactInfo.screenName, $imageId)
          profileInfo.checkProfileInMyProfile(orgAdmin.contactInfo.fullName.myProfile, $imageId)
          profileInfo.checkProfileHeadline(orgAdmin.contactInfo.headline)
        })

        context('Verify emails', () => {
          const personal = orgAdmin.contactInfo.emails.personal
          profileInfo.expectedShowEmails(personal.type, personal.emails[0])
        })

        context('Verify addresses', () => {
          const addresses = orgAdmin.contactInfo.addresses
          profileInfo.expectedShowAddress(
            addresses.workAddress,
            addresses.sendingCountryAddress,
            addresses.fieldSideAddress
          )
        })

        context('Verify phone number', () => {
          const phoneNumbers = orgAdmin.contactInfo.phoneNumbers.personal
          profileInfo.expectedShowPhoneNumber(
            phoneNumbers.brazil,
            phoneNumbers.india,
            phoneNumbers.germany
          )
        })

        context('Verify details', () => {
          profileInfo.verifyDetailInfo(details)
          profileInfo.expectedShowSocialLinks(
            'Website',
            details.website[0],
            details.website[1],
            details.website[2]
          )
          profileInfo.expectedShowSocialLinks(
            'Social Network',
            details.socialMedia.facebook[0],
            details.socialMedia.instagram[0],
            details.socialMedia.twitter[0]
          )
        })

        context('Verify expertise and qualification', () => {
          profileInfo.verifyExpertiseAndQualifications({
            skillsAndExpertise: expertiseQualifications.skillsAndExpertise.items,
            languages: expertiseQualifications.languages.items,
            interestsAndHobbies: expertiseQualifications.interestsAndHobbies.items,
          })
        })

        context('Verify access external link popup', () => {
          profileInfo.expectedShowAccessExternalLinkPopup('Website', details.website[0])
          profileInfo.expectedShowAccessExternalLinkPopup(
            'Social Network',
            details.socialMedia.facebook[0]
          )
        })
      })
    })
  })
})
