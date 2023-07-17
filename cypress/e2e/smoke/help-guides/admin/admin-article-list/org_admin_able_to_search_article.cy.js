import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import AdminHelpGuideIntercept from '../../../../../classes/help-guides/base-help-guides/operation/AdminHelpGuideIntercept'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const adminHelpGuide = new AdminHelpGuide()
  const articleListScreen = new ArticleListScreen()
  const faker = new Faker()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()

  beforeEach(() => {
    adminHelpGuideLogin.signInAsOrgAdminToTab('articles')
    adminHelpGuide.initToolbarHeader()
  })
  context(Story.adminArticleList, () => {
    it('Org Admin able to search article', () => {
      Story.ticket('QA-277')
      const article = articleListScreen.inviteUserToOrganization
      articleListScreen.searchArticle(article)

      articleListScreen.checkArticleByName(article)
      articleListScreen.hasTag('Video')
      articleListScreen.hasTag(faker.getAuTextNotDelete('Security'))
      articleListScreen.hasTag(faker.getAuTextNotDelete('Learning Admins'))
      articleListScreen.hasTag(faker.getAuTextNotDelete('Automate'))
    })
  })
})
