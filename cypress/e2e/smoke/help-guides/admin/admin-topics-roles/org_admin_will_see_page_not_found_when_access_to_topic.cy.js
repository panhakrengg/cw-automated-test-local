import Epic from '../../../../../classes/Epic'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import HelpGuidesHome from '../../../../../classes/help-guides/home/HelpGuidesHome'
import Story from '../../../../../classes/Story'

const adminHelpGuideLogin = new AdminHelpGuideLogin()
const helpGuideHome = new HelpGuidesHome()

describe(Epic.HelpGuides, () => {
  context(Story.adminTopicsRoles, () => {
    it('Org Admin will see Page not found when access to topic via link', () => {
      Story.ticket('QA-293')

      cy.logInTestCase('Sign in as organization admin')
      helpGuideHome.interceptFilter()
      adminHelpGuideLogin.signInAsOrgAdminToTab('articles')

      cy.logInTestCase('Paste topic link')
      helpGuideHome.visitFirstBeforePastLink()
      adminHelpGuideLogin.tabNav.visitTopic()

      cy.logInTestCase('show “Oops! Page not found.”')
      cy.pageNotFound()
    })
  })
})
