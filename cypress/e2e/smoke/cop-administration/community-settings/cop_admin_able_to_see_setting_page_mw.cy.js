import { MWCopSettingsAdmin } from '../../../../classes/constants/cop/AdministrationSettings'
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
    it('CoP Admin able to see Setting page - MW', () => {
      Story.ticket('QA-712')
      cy.logInTestCase('Sign In And Visit Admin Setting Page')
      signInAsCoP.admin_Kendal(coPAdminMock.getMwCoPSmokeAdminUrl())
      adminSettings.setUrl(coPAdminMock.getMwCoPSmokeAdminUrl())
      adminSettings.setCopName(coPAdminMock.getMwCoPSmokeNameUrl())
      adminSettings.setUserFullName(queryCoPUserInfo._ownerKristyFullName())
      adminSettings.visitAdminSettingsPage()

      adminSettings.expectToSeeCollapsableOptions(MWCopSettingsAdmin.collapses)
      adminSettings.expectToSeeVisibility(MWCopSettingsAdmin.collapses.visibility)
      adminSettings.expectToSeeFeatures(MWCopSettingsAdmin.collapses.features)
      adminSettings.expectToSeeMemberPermission(MWCopSettingsAdmin.collapses.memberPermission)
      adminSettings.expectToSeeBannerEmpty(MWCopSettingsAdmin.collapses.banner)
    })
  })
})
