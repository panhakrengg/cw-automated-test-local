import Epic from '../../../classes/Epic'
import ProfileInfo from '../../../classes/my-profile/ProfileInfo'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  context(Story.profileVisibility, () => {
    const profileInfo = new ProfileInfo()
    let auPfSwitchCoP
    let auPfSwitchCoPScreenName
    let community
    let oldPrimaryCopName
    let newPrimaryCopName
    before(() => {
      profileInfo.stub.getProfileStatic((data) => {
        auPfSwitchCoP = data.users.auPfSwitchCoP
        auPfSwitchCoPScreenName = auPfSwitchCoP.contactInfo.screenName
        community = auPfSwitchCoP.community
      })
    })

    beforeEach(() => {
      profileInfo.login.toProfilePageAsAuPfSwitchCoP()
    })

    it('Org Member switch primary CoP', () => {
      Story.ticket('QA-812')

      context('Reset data', () => {
        profileInfo.clickCommunityTab()
        profileInfo.clickEditMyCommunity()
        profileInfo.selectPrimaryCop(community.startLearning.name)
        if (Cypress.currentRetry == 1) {
          profileInfo.selectPrimaryCop(community.webLearn.name)
        }
        profileInfo.clickButtonSaveEditCopPopup()
      })

      context('Switch primary cop', () => {
        profileInfo.getPrimaryCopName()
        oldPrimaryCopName = cy.get('@primaryCopName').invoke('text')
        profileInfo.clickEditMyCommunity()
        profileInfo.selectPrimaryCop(community.webLearn.name)
        profileInfo.clickButtonSaveEditCopPopup()
        profileInfo.getPrimaryCopName()
        newPrimaryCopName = cy.get('@primaryCopName').invoke('text')
        context('Expected org member himself see updated primary', () => {
          profileInfo.expectedPrimaryCopUpdate(oldPrimaryCopName)
        })
      })

      context('Expected team leader could see update primary cop', () => {
        SignInAs.teamLeaderRootOrgUnit(profileInfo.getProfileUrl(auPfSwitchCoP.uuid))
        profileInfo.expectedSeePrimaryCop(community.webLearn.name, auPfSwitchCoPScreenName)
      })

      context('Expected org admin could see update primary cop', () => {
        SignInAs.orgAdmin(profileInfo.getProfileUrl(auPfSwitchCoP.uuid))
        profileInfo.expectedSeePrimaryCop(community.webLearn.name, auPfSwitchCoPScreenName)
      })

      context('Expected freemium user see empty state', () => {
        SignInAs.freemiumUser(profileInfo.getProfileUrl(auPfSwitchCoP.uuid))
        profileInfo.expectShowEmptyState(auPfSwitchCoPScreenName)
      })

      context('Expected cw normal user see empty state', () => {
        profileInfo.itcFetchCommunity.set()
        SignInAs.courseInstanceMember(profileInfo.getProfileUrl(auPfSwitchCoP.uuid))
        profileInfo.itcFetchCommunity.wait()
        profileInfo.expectShowEmptyState(auPfSwitchCoPScreenName)
      })
    })
  })
})
