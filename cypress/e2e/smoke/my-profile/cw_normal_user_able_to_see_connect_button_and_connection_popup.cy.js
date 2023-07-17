import Epic from '../../../classes/Epic'
import ProfileConnection from '../../../classes/my-profile/ProfileConnection'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, () => {
  const profileConnection = new ProfileConnection()
  context(Story.profileConnection, () => {
    let profileStatic
    let orgAdmin
    let aueEldredLegros
    let addConnection

    before(() => {
      profileConnection.stub.getProfileStatic((data) => {
        profileStatic = data
        orgAdmin = profileStatic.users.orgAdmin
        aueEldredLegros = profileStatic.users.aueEldredLegros.contactInfo
      })
      profileConnection.stub.getAddConnection((data) => {
        addConnection = data
      })
    })

    it('Cw Normal User able to see connect button and add connection popup from public profile', () => {
      Story.ticket('QA-824')
      SignInAs.aueEldredLegros()
      profileConnection.visitOtherUserProfileUrl(orgAdmin.uuid)
      profileConnection.clickConnectButton()
      profileConnection.verifyAddConnectionPopup(
        addConnection.cecPopUp,
        addConnection.personalNote,
        `${orgAdmin.contactInfo.givenName} ${orgAdmin.contactInfo.familyName}`
      )
    })
  })
})
