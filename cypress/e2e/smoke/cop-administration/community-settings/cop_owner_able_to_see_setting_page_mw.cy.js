import { MWCopSettingsOwner } from '../../../../classes/constants/cop/AdministrationSettings'
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

  context(Story.communitySettings, () => {
    before(() => {
      coPAdminMock.setSmokeCommunity()
      queryCoPUserInfo.setCoPUser()
    })
    it('CoP Owner able to see Setting page - MW', () => {
      Story.ticket('QA-595')
      cy.logInTestCase('Sign In And Visit Admin Setting Page')
      signInAsCoP.owner_Kristy(coPAdminMock.getMwCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getMwCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getMwCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())
      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(MWCopSettingsOwner.collapses)
      adminSettings.expectToSeeVisibility(MWCopSettingsOwner.collapses.visibility)
      adminSettings.expectToSeeDefaultPostAuthor(MWCopSettingsOwner.collapses.defaultPostAuthor)
      adminSettings.expectToSeeFeatures(MWCopSettingsOwner.collapses.features)
      adminSettings.expectToSeeBannerEmpty(MWCopSettingsOwner.collapses.banner)
      adminSettings.expectToSeeMemberPermission(MWCopSettingsOwner.collapses.memberPermission)
      adminSettings.expectToSeeOwnership(MWCopSettingsOwner.collapses.ownership)
      adminSettings.expectToSeeDeletion(MWCopSettingsOwner.collapses.deletion)
    })
  })
})
