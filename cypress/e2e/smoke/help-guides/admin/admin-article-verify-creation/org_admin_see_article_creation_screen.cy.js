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
    it('Org admin of 1 org able to see PROPERTIES ', () => {
      Story.ticket('QA-281')
      describe('sign in by organization admin', () => {
        adminHelpGuideLogin.signInAsOrgAdminToTab()
      })
      describe('click new article', () => {
        articleListScreen.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
      })
      describe('verify PROPERTIES', () => {
        adminArticleModify.expectTotalProperties(3)
        adminArticleModify.hasManagedBy()
        adminArticleModify.hasTopics()
        adminArticleModify.hasRoles()
        adminArticleModify.hasFeatureImage('@featuredImageBody', false)
      })
    })
  })
})
