import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileConnection from '../../../classes/my-profile/ProfileConnection'
import WebNotification from '../../../classes/notification/WebNotification'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileConnection = new ProfileConnection()
  const webNotification = new WebNotification()
  const globalSearch = new GlobalSearch()
  context(Story.profileConnection, () => {
    let instanceMember
    let aueEldredLegros
    let addConnection
    let instanceMemberScreenName

    before(() => {
      profileConnection.stub.getProfileStatic((data) => {
        instanceMember = data.users.instanceMember
        aueEldredLegros = data.users.aueEldredLegros.contactInfo
        instanceMemberScreenName = instanceMember.contactInfo.screenName
      })
      profileConnection.stub.getAddConnection((data) => {
        addConnection = data
      })
    })

    it('Cw Normal User add connection to another Cw Normal User from public profile', () => {
      Story.ticket('QA-823')
      context(`Visit ${instanceMemberScreenName}`, () => {
        SignInAs.aueEldredLegros()
        profileConnection.visitOtherUserProfileUrl(instanceMember.uuid)
      })

      context('Prepare data', () => {
        cy.get('.user-profile-wrapper').then(($profileWrapper) => {
          cy.wrap($profileWrapper).as('connectionCard')
          if ($profileWrapper.find('.connect-button:contains("Connection Request Sent")').length) {
            profileConnection.cancelConnectionRequest()
          } else if ($profileWrapper.find('.connect-button:contains("Message")').length) {
            profileConnection.removeConnection()
          }
        })
      })

      context(`Send connection request to ${instanceMemberScreenName}`, () => {
        profileConnection.clickConnectButton()
        profileConnection.sendRequestConnectionInMyProfile(
          addConnection.cecPopUp,
          addConnection.personalNote,
          instanceMemberScreenName
        )
      })

      context('Expected cw normal user see connection request button', () => {
        profileConnection.showConnectionRequestSentButtonInMyProfile()
        globalSearch.search(instanceMemberScreenName)
        profileConnection.showConnectionRequestSentButton()
      })

      context(
        `Expected ${instanceMemberScreenName} receive web notification and click deny`,
        () => {
          SignInAs.courseInstanceMember()
          webNotification.show()
          webNotification.selectRequestsTab()
          webNotification.denyConnectionRequest(
            aueEldredLegros.screenName,
            addConnection.personalNote
          )
        }
      )

      context(`Expected ${instanceMemberScreenName} user receive connection request email`, () => {
        profileConnection.verifyConnectionRequestEmail(
          instanceMember.contactInfo.emails.preferred.emails[0]
        )
      })

      context(`Visit ${instanceMemberScreenName}`, () => {
        cy.signOut()
        SignInAs.aueEldredLegros()
        profileConnection.visitOtherUserProfileUrl(instanceMember.uuid)
      })

      context(`Send connection request to ${instanceMemberScreenName}`, () => {
        profileConnection.clickConnectButton()
        profileConnection.sendRequestConnectionInMyProfile(
          addConnection.cecPopUp,
          addConnection.personalNote,
          instanceMemberScreenName
        )
      })

      context(`Expected ${instanceMemberScreenName} receive web notification and accept`, () => {
        SignInAs.courseInstanceMember()
        webNotification.show()
        webNotification.selectRequestsTab()
        webNotification.approveConnectionRequest(
          aueEldredLegros.screenName,
          addConnection.personalNote
        )
      })

      context('Verify my connection', () => {
        profileConnection.visitMyConnectionPage()
        profileConnection.expectedUserExistInMyConnection(aueEldredLegros.screenName)
      })

      context('Remove connection', () => {
        profileConnection.removeConnection()
      })
    })
  })
})
