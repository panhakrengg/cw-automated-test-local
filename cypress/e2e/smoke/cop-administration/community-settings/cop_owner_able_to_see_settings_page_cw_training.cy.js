import { CwTrainingCopSettingsOwner } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Owner able to see Setting page -  CW Training', () => {
      Story.ticket('QA-1923')
      signInAsCoP.owner_Kristy(coPAdminMock.getCwTCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getCwTCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getCwTCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())

      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(CwTrainingCopSettingsOwner.collapses)
      adminSettings.expectToSeeVisibility(CwTrainingCopSettingsOwner.collapses.visibility)
      adminSettings.expectToSeeDefaultPostAuthor(
        CwTrainingCopSettingsOwner.collapses.defaultPostAuthor
      )
      adminSettings.expectToSeeFeatures(CwTrainingCopSettingsOwner.collapses.features)
      adminSettings.expectToSeeMemberPermission(
        CwTrainingCopSettingsOwner.collapses.memberPermission
      )
      adminSettings.expectToSeeBannerEmpty(CwTrainingCopSettingsOwner.collapses.banner, true)
      adminSettings.expectToSeeOwnership(CwTrainingCopSettingsOwner.collapses.ownership)
      adminSettings.expectToSeeDeletion(CwTrainingCopSettingsOwner.collapses.deletion)
    })
  })
})
