import Epic from '../../../../../classes/Epic'
import ModifyBannerScreen from '../../../../../classes/help-guides/admin/ModifyBannerScreen'
import AdminNavigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

describe(Epic.HelpGuides, () => {
  const adminBanner = new ModifyBannerScreen()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const adminNavigation = new AdminNavigation()
  const helpGuideFixture = new HelpGuideFixture()
  const helpGuideHome = new HelpGuidesHome()
  context(Story.adminBanner, () => {
    it('Update banner', () => {
      Story.ticket('QA-310')
      helpGuideFixture.getData()

      cy.get('@helpGuide').then((helGuide) => {
        const viewHelpGuideHomeBy = helGuide.home.banner.viewBy

        adminHelpGuideLogin.signInAsAdminToTab()
        adminNavigation.clickBanner()
        adminBanner.modify()
        helpGuideHome.visitThenViewBannerModified(viewHelpGuideHomeBy.crosswiredUser)
        helpGuideHome.visitThenViewBannerModified(viewHelpGuideHomeBy.organizationMember)
      })
    })
  })
})
