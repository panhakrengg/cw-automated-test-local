import { TrainingCopSettingsAdmin } from '../../../../classes/constants/cop/AdministrationSettings'
import AdminSettings from '../../../../classes/cop/cop-administration/admin/AdminSettings'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import QueryCoPUserInfo from '../../../../classes/cop/cop-administration/base-administration/QueryCoPUserInfo'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const adminSettings = new AdminSettings()
  const queryCoPUserInfo = new QueryCoPUserInfo()
  const signInAsCoP = new SignInAsCoP()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    queryCoPUserInfo.setCoPUser()
  })

  context(Story.communitySettings, () => {
    it('CoP Admin able to see Setting page - Training', () => {
      Story.ticket('QA-715')
      signInAsCoP.admin_Kendal(coPAdminMock.getTCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getTCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getTCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._adminKendalFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(TrainingCopSettingsAdmin.collapses)
      adminSettings.expectToSeeVisibility(TrainingCopSettingsAdmin.collapses.visibility)
      adminSettings.expectToSeeFeatures(TrainingCopSettingsAdmin.collapses.features)
      adminSettings.expectToSeeMemberPermission(TrainingCopSettingsAdmin.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(TrainingCopSettingsAdmin.collapses.banner, true)
    })
  })
})
