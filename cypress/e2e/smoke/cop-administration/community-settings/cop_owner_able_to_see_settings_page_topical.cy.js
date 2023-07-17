import { TopicalCopSettingsOwner } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Owner able to see Setting page - Topical', () => {
      Story.ticket('QA-710')
      signInAsCoP.owner_Kristy(coPAdminMock.getTPCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getTPCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getTPCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(TopicalCopSettingsOwner.collapses)
      adminSettings.expectToSeeVisibility(TopicalCopSettingsOwner.collapses.visibility)
      adminSettings.expectToSeeDefaultPostAuthor(
        TopicalCopSettingsOwner.collapses.defaultPostAuthor
      )
      adminSettings.expectToSeeFeatures(TopicalCopSettingsOwner.collapses.features)
      adminSettings.expectToSeeMemberPermission(TopicalCopSettingsOwner.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(TopicalCopSettingsOwner.collapses.banner)
      adminSettings.expectToSeeOwnership(TopicalCopSettingsOwner.collapses.ownership)
      adminSettings.expectToSeeDeletion(TopicalCopSettingsOwner.collapses.deletion)
    })
  })
})
