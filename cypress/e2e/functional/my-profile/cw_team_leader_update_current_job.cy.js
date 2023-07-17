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

    it('Team Leader update current job', () => {
      Story.ticket('QA-314')
      context('Reset Data if exist', () => {
        details.clickEditDetails()
        details.removeAllJobTitles()
        details.removeAllPositions()
        cy.get('button:contains("Update my profile")')
          .invoke('prop', 'disabled')
          .then(($disabled) => {
            if (!$disabled) details.clickButtonUpdateMyProfile()
          })
      })

      context('Update current job', () => {
        details.updateCompany(teamLeaderDetails.update)
        details.updateVisibilityBy('Company/Org', 'Platform')
        details.addJobTitle(teamLeaderDetails.update)
        details.updateVisibilityBy('Job Title', 'Platform')
        details.addPosition(teamLeaderDetails.update)
        details.updateVisibilityBy('Position', 'Platform')
        details.clickButtonUpdateMyProfile()
        details.clickLinkBackToMyProfile()
        profileInfo.verifyCurrentJobSection({
          company: teamLeader.details.update.company,
          jobTitle: `${teamLeader.details.jobTitle}, ${teamLeader.details.update.jobTitle}`,
          position: `${teamLeader.details.position}, ${teamLeader.details.update.position}`,
        })
      })

      context('View by free user', () => {
        details.itcFetchViewMode.set()
        SignInAs.freemiumUser(details.getProfileUrl(teamLeader.uuid))
        details.itcFetchViewMode.wait()
        profileInfo.verifyCurrentJobSection({
          company: teamLeader.details.update.company,
          jobTitle: `${teamLeader.details.jobTitle}, ${teamLeader.details.update.jobTitle}`,
          position: `${teamLeader.details.position}, ${teamLeader.details.update.position}`,
        })
      })

      context('View by cw normal user', () => {
        details.itcFetchViewMode.set()
        SignInAs.ciMember(details.getProfileUrl(teamLeader.uuid))
        details.itcFetchViewMode.wait()
        profileInfo.verifyCurrentJobSection({
          company: teamLeader.details.update.company,
          jobTitle: `${teamLeader.details.jobTitle}, ${teamLeader.details.update.jobTitle}`,
          position: `${teamLeader.details.position}, ${teamLeader.details.update.position}`,
        })
      })

      context('View by org member user', () => {
        SignInAs.orgMember(details.getProfileUrl(teamLeader.uuid))
        profileInfo.verifyCurrentJobSection({
          company: teamLeader.details.update.company,
          jobTitle: `${teamLeader.details.jobTitle}, ${teamLeader.details.update.jobTitle}`,
          position: `${teamLeader.details.position}, ${teamLeader.details.update.position}`,
        })
      })

      context('View by org admin', () => {
        details.itcFetchViewMode.set()
        SignInAs.orgAdmin(details.getProfileUrl(teamLeader.uuid))
        details.itcFetchViewMode.wait()
        profileInfo.verifyCurrentJobSection({
          company: teamLeader.details.update.company,
          jobTitle: `${teamLeader.details.jobTitle}, ${teamLeader.details.update.jobTitle}`,
          position: `${teamLeader.details.position}, ${teamLeader.details.update.position}`,
        })
      })

      context('Reset Data', () => {
        details.login.toProfilePageAsTeamLeader()
        details.clickEditDetails()
        details.removeAllJobTitles()
        details.removeAllPositions()
        details.updateVisibilityBy('Company/Org', 'Organization')
        details.updateVisibilityBy('Job Title', 'Network')
        details.clickButtonUpdateMyProfile()
      })
    })
  })
})
