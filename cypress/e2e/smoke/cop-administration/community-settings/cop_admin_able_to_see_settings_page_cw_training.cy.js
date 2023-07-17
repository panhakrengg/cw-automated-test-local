import { CwTrainingCopSettingsAdmin } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Admin able to see Setting page - CW Training', () => {
      Story.ticket('QA-1924')
      signInAsCoP.admin_Kendal(coPAdminMock.getCwTCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getCwTCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getCwTCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._adminKendalFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(CwTrainingCopSettingsAdmin.collapses)
      adminSettings.expectToSeeVisibility(CwTrainingCopSettingsAdmin.collapses.visibility)
      adminSettings.expectToSeeFeatures(CwTrainingCopSettingsAdmin.collapses.features)
      adminSettings.expectToSeeMemberPermission(
        CwTrainingCopSettingsAdmin.collapses.memberPermission
      )
      adminSettings.expectToSeeBannerEmpty(CwTrainingCopSettingsAdmin.collapses.banner, true)
    })
  })
})
