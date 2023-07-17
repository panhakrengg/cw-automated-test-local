import Epic from '../../../classes/Epic'
import Connections from '../../../classes/global-search/Connections'
import Setting from '../../../classes/my-profile/Setting'
import Story from '../../../classes/Story'
import SignInAs from '../../../classes/utilities/SignInAs'

describe(Epic.Profile, { retries: 2 }, () => {
  const setting = new Setting()
  const connections = new Connections()

  context(Story.profileGlobalSearchSetting, () => {
    let orgMgtUser
    let screenName

    before(() => {
      setting.stub.getProfileStatic((data) => {
        orgMgtUser = data.users.orgMgtUser
        screenName = orgMgtUser.contactInfo.screenName
      })
      setting.readSettingVisibilityBodyFromYaml()
    })

    beforeEach(() => {
      setting.login.toProfilePageAsOrgMember()
    })

    it('Org Member turn off profile in search for all users and others in the same organization', () => {
      Story.ticket('QA-368')
      context('Turn off search profile visibility', () => {
        setting.clickSettingIcon()
        setting.initGlobalSearchElement()
        setting.initOrgProfileElement()
        setting.turnOffAllUserCanSee()
        setting.turnOffOtherInMyOrgCanFindMe()
        setting.turnOffOtherInMyOrgCanView()
      })

      context('Team leader not able to search in global', () => {
        SignInAs.teamLeaderRootOrgUnit()
        connections.orgUserCannotSearchUserInGlobal(screenName)
      })

      context('Cw free user not able to search in global', () => {
        SignInAs.freemiumUser()
        connections.normalUserCannotSearchUserInGlobal(screenName)
      })

      context('Cw normal user not able to search in global', () => {
        SignInAs.cwNormalUser()
        connections.normalUserCannotSearchUserInGlobal(screenName)
      })

      context('Reset data', () => {
        setting.login.toProfilePageAsOrgMember()
        setting.clickSettingIcon()
        setting.initGlobalSearchElement()
        setting.turnOnAllUserCanSee()
      })
    })

    it('Org Member turn on searchable profile in global search for organization but off for all users', () => {
      Story.ticket('QA-814', ['QA-814?focusedCommentId=53443']) // No ticket yet
      context('Turn on search profile visibility by organization', () => {
        setting.clickSettingIcon()
        setting.initGlobalSearchElement()
        setting.initOrgProfileElement()
        setting.turnOffAllUserCanSee()
        setting.turnOnOtherInMyOrgCanFindMe()
        setting.turnOffOtherInMyOrgCanView()
      })

      context('Cw free user not able to search in global', () => {
        SignInAs.freemiumUser()
        connections.normalUserCannotSearchUserInGlobal(screenName)
      })

      context('Cw normal user not able to search in global', () => {
        SignInAs.cwNormalUser()
        connections.normalUserCannotSearchUserInGlobal(screenName)
      })

      //There is an issue that team leader can't search org member in the same org unit
      // context('Team leader able to search in global', () => {
      //   SignInAs.teamLeaderRootOrgUnit()
      //   setting.orgUserCanSearchUser(screenName)
      // })

      context('Org admin able to search in global', () => {
        SignInAs.orgAdmin()
        connections.orgUserCanSearchUserInGlobal(screenName)
      })

      context('Org user able to search in global', () => {
        SignInAs.orgMemberDesignFrontend()
        connections.orgUserCanSearchUserInGlobal(screenName)
      })

      context('Reset data', () => {
        setting.login.toProfilePageAsOrgMember()
        setting.clickSettingIcon()
        setting.initGlobalSearchElement()
        setting.turnOnAllUserCanSee()
        setting.initOrgProfileElement()
        setting.turnOnOtherInMyOrgCanView()
      })
    })
  })
})
