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
    it('Help Guide and Org admin can see all topics in modify article', () => {
      Story.ticket('QA-303')

      cy.logInTestCase('Click topics')
      adminHelpGuideLogin.signInAsAdminToTab()
      adminNavigation.clickTopics()

      table.getCellTextAsArray(0).then((allTopics) => {
        const topicPropertyAlias = '@topicBody'
        cy.logInTestCase('Help guide admin can see all topics in creation screen')
        adminNavigation.clickArticles()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.expectAllValueNotSelect(topicPropertyAlias, allTopics)

        cy.logInTestCase('Org admin can see all topics in creation screen')
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        adminNavigation.clickArticles()
        adminArticleList.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
        adminArticleModify.expectAllValueNotSelect(topicPropertyAlias, allTopics)
      })
    })
  })
})
