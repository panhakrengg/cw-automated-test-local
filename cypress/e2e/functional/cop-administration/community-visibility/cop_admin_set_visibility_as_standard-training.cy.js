import AdminSettings from '../../../../classes/cop/cop-administration/admin/AdminSettings'
import CommunityVisibility from '../../../../classes/cop/cop-administration/admin/CommunityVisibility'
import CoPAdminMock from '../../../../classes/cop/cop-administration/base-administration/CoPAdminMock'
import SignInAsCoP from '../../../../classes/cop/cop-administration/base-administration/SignInAsCoP'
import Epic from '../../../../classes/Epic'
import Story from '../../../../classes/Story'

describe(Epic.CoPAdministration, () => {
  const coPAdminMock = new CoPAdminMock()
  const communityVisibility = new CommunityVisibility()
  const adminSettings = new AdminSettings()
  const signInAsCoP = new SignInAsCoP()

  before(() => {
    coPAdminMock.setCommunityVisibility()
  })

  context(Story.communityVisibility, () => {
    it('CoP Admin set visibility as Standard - Training', () => {
      Story.ticket('QA-749')
      adminSettings.setUrl(coPAdminMock.getTCoPFuncStandardAdminUrl())

      signInAsCoP.admin_Kendal()
      adminSettings.visitAdminSettingsPage()

      cy.logInTestCase('Reset: Make Cop to Unlisted')
      adminSettings.resetToUnlisted()

      cy.logInTestCase('Make Cop Visibility To Standard')
      adminSettings.saveVisibility('Standard')
      adminSettings.expectSettingsHaveBeenSaved()

      cy.logInTestCase('Visit Community Page & Expect Cop Display Without Unlisted Label')
      communityVisibility.visitCommunitiesPage()
      communityVisibility.expectCopFoundWithoutUnlistedLabel(coPAdminMock.getTCoPFuncStandardName())
    })
  })
})
