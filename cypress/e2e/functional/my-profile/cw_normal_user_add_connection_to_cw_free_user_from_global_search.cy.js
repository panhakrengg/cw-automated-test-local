import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileConnection from '../../../classes/my-profile/ProfileConnection'
import WebNotification from '../../../classes/notification/WebNotification'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileConnection = new ProfileConnection()
  const webNotification = new WebNotification()
  const globalSearch = new GlobalSearch()
  context(Story.profileConnection, () => {
    let freemiumUser
    let aueEldredLegros
    let personalNote

    before(() => {
      profileConnection.stub.getProfileStatic((data) => {
        freemiumUser = data.users.freemium.contactInfo
        aueEldredLegros = data.users.aueEldredLegros.contactInfo
      })
      profileConnection.stub.getAddConnection((data) => {
        personalNote = data.personalNote
      })
    })

    it('Cw Normal User add connection to Cw Free User from global search but get deny', () => {
      Story.ticket('QA-821')
      context('Send connection request to cw free user', () => {
        SignInAs.aueEldredLegros()
        globalSearch.search(freemiumUser.screenName)
        profileConnection.clickAddConnectionButton(() => {
          profileConnection.sendRequestConnection(personalNote)
        })
      })

      context('Expected cw normal user see connection request button', () => {
        profileConnection.showConnectionRequestSentButton()
        profileConnection.clickProfileUserCard()
        profileConnection.showConnectionRequestSentButtonInMyProfile()
      })

      context('Expected cw free user receive web notification', () => {
        SignInAs.freemiumUser()
        webNotification.show()
        webNotification.selectRequestsTab()
        webNotification.denyConnectionRequest(aueEldredLegros.screenName, personalNote)
      })

      context('Expected cw free user receive connection request email', () => {
        profileConnection.verifyConnectionRequestEmail(freemiumUser.emails.preferred.emails[0])
      })
    })
  })
})
