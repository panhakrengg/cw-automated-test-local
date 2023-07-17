import { OrgCopSettingsAdmin } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Admin able to see Setting page - Org', () => {
      Story.ticket('QA-713')
      signInAsCoP.admin_Kendal(coPAdminMock.getOCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getOCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getOCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._adminKendalFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(OrgCopSettingsAdmin.collapses)
      adminSettings.expectToSeeVisibility(OrgCopSettingsAdmin.collapses.visibility)
      adminSettings.expectToSeeFeatures(OrgCopSettingsAdmin.collapses.features)
      adminSettings.expectToSeeMemberPermission(OrgCopSettingsAdmin.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(OrgCopSettingsAdmin.collapses.banner)
    })
  })
})
