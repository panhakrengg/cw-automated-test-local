import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 1 }, () => {
  const profileInfo = new ProfileInfo()
  const globalSearch = new GlobalSearch()
  let orgAdmin
  let expertiseQualifications
  let details

  context(Story.profileVisibility, () => {
    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        orgAdmin = data.users.orgAdmin
        expertiseQualifications = orgAdmin.expertiseQualifications
        details = orgAdmin.details
      })
    })

    it('Team Leader able to see Org Admin profile when has connection', () => {
      Story.ticket('QA-798')
      profileInfo.login.toProfilePageAsOrgAdmin()
      profileInfo.getProfileImageTokenId().then(($imageId) => {
        SignInAs.teamLeaderRootOrgUnit()
        context('Verify org admin profile in global search', () => {
          globalSearch.search(orgAdmin.contactInfo.screenName)
          profileInfo.checkProfileInGlobalSearch(
            orgAdmin.contactInfo.fullName.globalSearch,
            $imageId,
            'Message',
            true
          )
          profileInfo.checkProfileHeadline(orgAdmin.contactInfo.headline)
          profileInfo.clickProfileUserCard()
        })

        context('Verify org admin profile in my profile', () => {
          profileInfo.checkProfileInMyProfile(
            orgAdmin.contactInfo.fullName.myProfile,
            $imageId,
            'Message'
          )
          profileInfo.checkProfileHeadline(orgAdmin.contactInfo.headline)
        })

        context('Verify emails', () => {
          const emails = orgAdmin.contactInfo.emails
          profileInfo.expectedShowEmails(emails.personal.type, emails.personal.emails[0])
          profileInfo.expectedShowEmails(emails.work.type, emails.work.emails[0])
          profileInfo.expectedNotShowEmails(emails.preferred.type, emails.preferred.emails[0])
        })

        context('Verify addresses', () => {
          const addresses = orgAdmin.contactInfo.addresses
          profileInfo.expectedShowAddress(
            addresses.workAddress,
            addresses.sendingCountryAddress,
            addresses.fieldSideAddress,
            addresses.homeAddress
          )
        })

        context('Verify phone number', () => {
          const phoneNumbers = orgAdmin.contactInfo.phoneNumbers.personal
          profileInfo.expectedShowPhoneNumber(
            phoneNumbers.brazil,
            phoneNumbers.india,
            phoneNumbers.germany,
            phoneNumbers.america
          )
        })

        context('Verify details', () => {
          profileInfo.verifyDetailInfo(details)
          profileInfo.expectedShowSocialLinks(
            'Website',
            details.website[0],
            details.website[1],
            details.website[2],
            details.website[3]
          )
          profileInfo.expectedShowSocialLinks(
            'Social Network',
            details.socialMedia.facebook[0],
            details.socialMedia.instagram[0],
            details.socialMedia.twitter[0],
            details.socialMedia.linkIn[0]
          )
        })

        context('Verify expertise and qualification', () => {
          profileInfo.verifyExpertiseAndQualifications({
            areaOfFocus: expertiseQualifications.areaOfFocus.items,
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
