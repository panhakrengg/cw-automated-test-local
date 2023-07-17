import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, () => {
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const adminArticleModify = new ModifyArticle()

  beforeEach(() => {
    adminArticleModify.interceptEditor()
  })
  context(Story.adminArticleVerifyCreation, () => {
    it('Org Admin able to see Main Content', () => {
      Story.ticket('QA-279')
      cy.logInTestCase('sign in by organization admin')
      adminHelpGuideLogin.signInAsOrgAdminToTab()

      cy.logInTestCase('click new article')
      articleListScreen.clickNewArticleButton()
      adminArticleModify.initMainContent()

      cy.logInTestCase('verify main content')
      adminArticleModify.verifyMainContent()
    })
  })
})
