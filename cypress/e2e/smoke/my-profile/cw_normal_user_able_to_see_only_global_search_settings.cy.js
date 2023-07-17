import Epic from '../../../classes/Epic'
import Setting from '../../../classes/my-profile/Setting'
import Story from '../../../classes/Story'

describe(Epic.Profile, () => {
  const setting = new Setting()
  context(Story.profileGlobalSearchSetting, () => {
    let settings
    before(() => {
      setting.stub.getSettings((data) => {
        settings = data
      })
      setting.readSettingVisibilityBodyFromYaml()
    })

    beforeEach(() => {
      setting.login.toProfilePageAsInstanceMember()
    })

    it('Cw Normal User able to see only global search setting', () => {
      Story.ticket('QA-816')
      setting.clickSettingIcon()
      setting.initGlobalSearchElement()
      setting.expectedToSeeGlobalSearchTitle(settings.body.globalSearch.label)
      setting.expectedToSeeAllUsersCanFindMeAndTurnOnToggle(settings.body.globalSearch)
      setting.expectedNotSeeOrgProfileTitle(settings.body.orgProfile)
    })
  })
})
