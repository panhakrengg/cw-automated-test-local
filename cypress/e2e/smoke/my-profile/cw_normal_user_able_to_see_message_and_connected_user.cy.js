import Epic from '../../../classes/Epic'
import GlobalSearch from '../../../classes/global-search/GlobalSearch'
import ProfileConnection from '../../../classes/my-profile/ProfileConnection'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const profileConnection = new ProfileConnection()
  const globalSearch = new GlobalSearch()
  context(Story.profileConnection, () => {
    let orgMgtUser
    let orgMgtUserScreenName
    before(() => {
      profileConnection.stub.getProfileStatic((profileStatic) => {
        orgMgtUser = profileStatic.users.orgMgtUser
        orgMgtUserScreenName = orgMgtUser.contactInfo.screenName
      })
    })

    it('Cw Normal User able to see message button to a connected user', () => {
      Story.ticket('QA-825')
      SignInAs.aueEldredLegros()
      globalSearch.search(orgMgtUser.contactInfo.screenName)
      profileConnection.clickMessageButtonInGlobalSearch()
      profileConnection.expectedMiniChatOpenAndSeeChatName(orgMgtUserScreenName)

      profileConnection.clickProfileUserCard()
      profileConnection.clickMessageButton()
      profileConnection.expectedMiniChatOpenAndSeeChatName(orgMgtUserScreenName)

      profileConnection.visitMyConnectionPage()
      profileConnection.clickMessageButtonInMyConnection(orgMgtUserScreenName)
      profileConnection.expectedMiniChatOpenAndSeeChatName(orgMgtUserScreenName)
    })
  })
})
