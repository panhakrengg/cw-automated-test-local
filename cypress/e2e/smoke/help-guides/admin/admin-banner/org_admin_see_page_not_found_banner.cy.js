import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ModifyBannerScreen from '../../../../../classes/help-guides/admin/ModifyBannerScreen'
import Navigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../../../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'

const adminHelpGuide = new AdminHelpGuide()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const helpGuideHome = new HelpGuidesHome()

describe(Epic.HelpGuides, () => {
  context(Story.adminBanner, () => {
    it('Org Admin will see Page not found when access to banner via link', () => {
      Story.ticket('QA-323')
      describe('Sign in as organization admin', () => {
        helpGuideHome.interceptFilter()
        adminHelpGuideLogin.signInAsOrgAdminToTab()
      })
      describe('Paste admin banner link', () => {
        helpGuideHome.visitFirstBeforePastLink()
        adminHelpGuideLogin.tabNav.visitBanner()
      })
      describe('show “Oops! Page not found.”', () => {
        cy.pageNotFound()
      })
    })
  })
})
