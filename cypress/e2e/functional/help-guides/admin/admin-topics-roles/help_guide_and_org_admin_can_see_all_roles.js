import Table from '../../../../../classes/components/Table'
import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminNavigation from '../../../../../classes/help-guides/admin/Navigation'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

const adminArticleList = new ArticleListScreen()
const adminArticleModify = new ModifyArticle()
const adminHelpGuide = new AdminHelpGuide()
const adminHelpGuideLogin = new AdminHelpGuideLogin()
const adminNavigation = new AdminNavigation()
const table = new Table('@Table')
describe(Epic.HelpGuides, { retries: 1 }, () => {
  before(() => {
    adminHelpGuide.initTable('Table')
  })

  context(Story.adminTopicsRoles, () => {
    it('Help Guide and Org admin can see all roles in modify article', () => {
      Story.ticket('QA-692')

      cy.logInTestCase('Click roles')
      adminHelpGuideLogin.signInAsAdminToTab()
      adminNavigation.clickRoles()

      table.getCellTextAsArray(0).then((allRoles) => {
        const rolePropertyAlias = '@roleBody'
        cy.logInTestCase('Help guide admin can see all roles in creation screen')
        adminNavigation.clickArticles()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.expectAllValueNotSelect(rolePropertyAlias, allRoles)

        cy.logInTestCase('Org admin can see all roles in creation screen')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminNavigation.clickArticles()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.expectAllValueNotSelect(rolePropertyAlias, allRoles)
      })
    })
  })
})
