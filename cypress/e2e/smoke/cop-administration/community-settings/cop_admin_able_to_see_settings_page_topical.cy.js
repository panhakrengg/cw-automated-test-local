import { TopicalCopSettingsAdmin } from '../../../../classes/constants/cop/AdministrationSettings'
import AdminSettings from '../../../../classes/cop/cop-administration/admin/AdminSettings'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import QueryCoPUserInfo from '../../../../classes/cop/cop-administration/base-administration/QueryCoPUserInfo'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, { tags: ['@skipPrd'] }, () => {
  const coPAdminMock = new CoPAdminMock()
  const adminSettings = new AdminSettings()
  const queryCoPUserInfo = new QueryCoPUserInfo()
  const signInAsCoP = new SignInAsCoP()

  before(() => {
    coPAdminMock.setSmokeCommunity()
    queryCoPUserInfo.setCoPUser()
  })

  context(Story.communitySettings, () => {
    it('CoP Admin able to see Setting page - Topical', () => {
      Story.ticket('QA-714')
      signInAsCoP.admin_Kendal(coPAdminMock.getTPCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getTPCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getTPCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._adminKendalFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(TopicalCopSettingsAdmin.collapses)
      adminSettings.expectToSeeVisibility(TopicalCopSettingsAdmin.collapses.visibility)
      adminSettings.expectToSeeFeatures(TopicalCopSettingsAdmin.collapses.features)
      adminSettings.expectToSeeMemberPermission(TopicalCopSettingsAdmin.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(TopicalCopSettingsAdmin.collapses.banner)
    })
  })
})
