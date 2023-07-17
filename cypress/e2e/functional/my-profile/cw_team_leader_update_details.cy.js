import Epic from '../../../classes/Epic'
import Details from '../../../classes/my-profile/Details'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const details = new Details()
  const profileInfo = new ProfileInfo()

  context(Story.profileDetailInfo, () => {
    let teamLeader
    let teamLeaderDetails

    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader
        teamLeaderDetails = teamLeader.details
      })
    })

    beforeEach(() => {
      details.login.toProfilePageAsTeamLeader()
    })

    it('Team Leader update details', () => {
      Story.ticket('QA-313')
      details.clickEditDetails()
      details.expectedShowRequiredErrorMessageForBirthday()
      details.updateDetailsSection(teamLeaderDetails.update)
      details.clickButtonUpdateMyProfile()
      details.expectedShowSuccessUpdateToast()
      details.clickLinkBackToMyProfile()
      profileInfo.verifyDetailSection({
        knownAs: teamLeaderDetails.update.knownAs,
        gender: teamLeaderDetails.update.gender,
        birthday: teamLeaderDetails.update.birthday.show,
      })

      context('View with free user', () => {
        SignInAs.freemiumUser(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedNotShowKnownAs()
        profileInfo.expectedNotShowGender()
        profileInfo.expectedNotShowBirthday()
      })

      context('View with normal user', () => {
        SignInAs.ciMember(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedNotShowGender()
        profileInfo.checkUserDetail('Known As:', teamLeaderDetails.update.knownAs)
        profileInfo.checkUserDetail('Birthday:', teamLeaderDetails.update.birthday.show)
      })

      context('View with org user', () => {
        SignInAs.orgMember(details.getProfileUrl(teamLeader.uuid))
        profileInfo.expectedNotShowKnownAs()
        profileInfo.checkUserDetail('Gender:', teamLeaderDetails.update.gender)
        profileInfo.checkUserDetail('Birthday:', teamLeaderDetails.update.birthday.show)
      })

      context('View with org admin', () => {
        SignInAs.orgAdmin(details.getProfileUrl(teamLeader.uuid))
        profileInfo.verifyDetailSection({
          knownAs: teamLeaderDetails.update.knownAs,
          gender: teamLeaderDetails.update.gender,
          birthday: teamLeaderDetails.update.birthday.show,
        })
      })

      context('Reset data', () => {
        details.login.toProfilePageAsTeamLeader()
        details.clickEditDetails()
        details.updateDetailsSection(teamLeaderDetails)
        details.clickButtonUpdateMyProfile()
        details.expectedShowSuccessUpdateToast()
        details.clickLinkBackToMyProfile()
        profileInfo.verifyDetailSection({
          knownAs: teamLeaderDetails.knownAs,
          gender: teamLeaderDetails.gender,
          birthday: teamLeaderDetails.birthday.show,
        })
      })
    })
  })
})
