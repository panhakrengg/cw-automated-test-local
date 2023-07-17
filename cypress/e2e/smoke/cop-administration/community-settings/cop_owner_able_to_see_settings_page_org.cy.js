import { OrgCopSettingsOwner } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Owner able to see Setting page - Org', () => {
      Story.ticket('QA-709')
      signInAsCoP.owner_Kristy(coPAdminMock.getOCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getOCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getOCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(OrgCopSettingsOwner.collapses)
      adminSettings.expectToSeeVisibility(OrgCopSettingsOwner.collapses.visibility)
      adminSettings.expectToSeeDefaultPostAuthor(OrgCopSettingsOwner.collapses.defaultPostAuthor)
      adminSettings.expectToSeeFeatures(OrgCopSettingsOwner.collapses.features)
      adminSettings.expectToSeeMemberPermission(OrgCopSettingsOwner.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(OrgCopSettingsOwner.collapses.banner)
      adminSettings.expectToSeeOwnership(OrgCopSettingsOwner.collapses.ownership)
      adminSettings.expectToSeeDeletion(OrgCopSettingsOwner.collapses.deletion)
    })
  })
})
