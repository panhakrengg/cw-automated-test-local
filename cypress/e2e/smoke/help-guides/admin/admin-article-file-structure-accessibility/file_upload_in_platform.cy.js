import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1, tags: '@skipPrd' }, () => {
  const platformOrgImg = 'platform_changeAccountEmail.png'
  const articleListScreen = new ArticleListScreen()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const modifyArticle = new ModifyArticle()

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Help Guide Admin & Org Admin able to see uploaded File (text editor) in Platform', () => {
      Story.ticket('QA-347')
      context('Help guide admin could platform image', () => {
        adminHelpGuideLogin.signInAsAdminToTab()
        articleListScreen.clickNewArticleButton()
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldSeeBelongOrgImage(platformOrgImg)
      })

      context('Org admin could not see platform image', () => {
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        articleListScreen.clickNewArticleButton()
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(platformOrgImg)
      })
    })
  })
})
