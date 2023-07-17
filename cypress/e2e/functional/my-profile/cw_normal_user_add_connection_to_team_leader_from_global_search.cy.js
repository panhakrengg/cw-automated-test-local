import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileConnection from '../../../classes/my-profile/ProfileConnection'
import WebNotification from '../../../classes/notification/WebNotification'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  context(Story.profileConnection, () => {
    const profileConnection = new ProfileConnection()
    const webNotification = new WebNotification()
    const globalSearch = new GlobalSearch()
    let teamLeader
    let aueEldredLegros
    let addConnection

    before(() => {
      profileConnection.stub.getProfileStatic((data) => {
        teamLeader = data.users.teamLeader.contactInfo
        aueEldredLegros = data.users.aueEldredLegros.contactInfo
      })
      profileConnection.stub.getAddConnection((data) => {
        addConnection = data
      })
    })

    it('Cw Normal User add connection to Team Leader from global search', () => {
      Story.ticket('QA-822')
      context('Send connection request to team leader user', () => {
        SignInAs.aueEldredLegros()
        globalSearch.search(teamLeader.screenName)
        profileConnection.clickAddConnectionButton(() => {
          profileConnection.sendRequestConnection(addConnection.personalNote)
        })
      })

      context('Expected cw normal user see connection request button', () => {
        profileConnection.showConnectionRequestSentButton()
        profileConnection.clickProfileUserCard()
        profileConnection.showConnectionRequestSentButtonInMyProfile()
      })

      context('Cw normal user cancel connection request', () => {
        profileConnection.cancelConnectionRequestWithNote(
          addConnection.swal2,
          addConnection.personalNote
        )
        profileConnection.showConnectButton()
      })

      context('Expected team leader not receive web notification', () => {
        SignInAs.teamLeaderRootOrgUnit()
        webNotification.clickOnWebNotificationIcon()
        webNotification.selectRequestsTab()
        webNotification.noConnectionRequestExist(aueEldredLegros.screenName)
      })

      context('Expected team leader user receive connection request email', () => {
        profileConnection.verifyConnectionRequestEmail(teamLeader.emails.preferred.emails[0])
      })
    })
  })
})
