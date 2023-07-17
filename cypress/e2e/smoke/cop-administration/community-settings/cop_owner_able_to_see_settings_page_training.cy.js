import { TrainingCopSettingsOwner } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Owner able to see Setting page - Training', () => {
      Story.ticket('QA-711')
      signInAsCoP.owner_Kristy(coPAdminMock.getTCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getTCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getTCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(TrainingCopSettingsOwner.collapses)
      adminSettings.expectToSeeVisibility(TrainingCopSettingsOwner.collapses.visibility)
      adminSettings.expectToSeeDefaultPostAuthor(
        TrainingCopSettingsOwner.collapses.defaultPostAuthor
      )
      adminSettings.expectToSeeFeatures(TrainingCopSettingsOwner.collapses.features)
      adminSettings.expectToSeeMemberPermission(TrainingCopSettingsOwner.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(TrainingCopSettingsOwner.collapses.banner, true)
      adminSettings.expectToSeeOwnership(TrainingCopSettingsOwner.collapses.ownership)
      adminSettings.expectToSeeDeletion(TrainingCopSettingsOwner.collapses.deletion)
    })
  })
})
