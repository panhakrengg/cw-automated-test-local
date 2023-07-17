import Epic from '../../../classes/Epic'
import Details from '../../../classes/my-profile/Details'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const details = new Details()
  const profileInfo = new ProfileInfo()

  context(Story.profileDetailInfo, () => {
    let teamLeader
    let teamLeaderDetails
    let socialMedias

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader
        teamLeaderDetails = teamLeader.details
        socialMedias = teamLeaderDetails.socialMedias
      })
    })

    beforeEach(() => {
      details.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader add a social website and social media', () => {
      Story.ticket('QA-315')

      cy.logInTestCase('Reset data')
      details.clickEditDetails()
      details.removeAllWebsites()
      details.removeAllSocialMedias()

      context('Add website and social media', () => {
        details.clickAddAnotherWebsite()
        for (let i = 0; i < 4; i++) {
          details.clickAddAnotherSocialMedia()
        }
        details.updateWebsiteSection(teamLeaderDetails.websites)
        details.updateSocialMediaSection(socialMedias)
        details.clickButtonUpdateMyProfile()
        details.expectedShowSuccessUpdateToast()
        details.clickLinkBackToMyProfile()
        profileInfo.expectedShowSocialLinks(
          'Website',
          teamLeaderDetails.websites[0],
          teamLeaderDetails.websites[1]
        )
        profileInfo.expectedShowSocialLinks(
          'Social Network',
          socialMedias.facebook.url,
          socialMedias.linkedIn.url,
          socialMedias.twitter.url,
          socialMedias.instagram.url,
          socialMedias.facebook2.url
        )
      })

      context('View by free user', () => {
        SignInAs.freemiumUser(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedShowSocialLinks(
          'Website',
          teamLeaderDetails.websites[0],
          teamLeaderDetails.websites[1]
        )
        profileInfo.expectedShowSocialLinks('Social Network', socialMedias.facebook2.url)
      })

      context('View by normal user', () => {
        SignInAs.ciMember(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedShowSocialLinks(
          'Website',
          teamLeaderDetails.websites[0],
          teamLeaderDetails.websites[1]
        )
        profileInfo.expectedShowSocialLinks(
          'Social Network',
          socialMedias.linkedIn.url,
          socialMedias.instagram.url,
          socialMedias.facebook2.url
        )
      })

      context('View by org member', () => {
        SignInAs.orgMember(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedShowSocialLinks(
          'Website',
          teamLeaderDetails.websites[0],
          teamLeaderDetails.websites[1]
        )
        profileInfo.expectedShowSocialLinks(
          'Social Network',
          socialMedias.twitter.url,
          socialMedias.instagram.url,
          socialMedias.facebook2.url
        )
      })

      context('View by org admin', () => {
        SignInAs.orgAdmin(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedShowSocialLinks(
          'Website',
          teamLeaderDetails.websites[0],
          teamLeaderDetails.websites[1]
        )
        profileInfo.expectedShowSocialLinks(
          'Social Network',
          socialMedias.linkedIn.url,
          socialMedias.twitter.url,
          socialMedias.instagram.url,
          socialMedias.facebook2.url
        )
      })

      context('Reset Data', () => {
        details.login.toProfilePageAsTeamLeader()
        details.clickEditDetails()
        details.removeAllWebsites()
        details.removeAllSocialMedias()
        details.clickButtonUpdateMyProfile()
        details.expectedShowSuccessUpdateToast()
      })
    })
  })
})
