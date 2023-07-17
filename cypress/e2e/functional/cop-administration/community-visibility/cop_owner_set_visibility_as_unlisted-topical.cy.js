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
    it('CoP Owner set visibility as Unlisted - Topical', () => {
      Story.ticket('QA-751')
      adminSettings.setUrl(coPAdminMock.getTPCoPFuncUnlistedAdminUrl())

      signInAsCoP.owner_Phoebe()
      adminSettings.visitAdminSettingsPage()

      cy.logInTestCase('Reset: Make Cop to Standard')
      adminSettings.resetToStandard()

      cy.logInTestCase('Make Cop Visibility To Unlisted')
      adminSettings.saveVisibility('Unlisted')
      adminSettings.expectSettingsHaveBeenSaved()

      cy.logInTestCase('Visit Community Page & Expect Cop Display With Unlisted Label')
      communityVisibility.visitCommunitiesPage()
      communityVisibility.expectCopFoundWithUnlistedLabel(coPAdminMock.getTPCoPFuncUnlistedName())
    })
  })
})
