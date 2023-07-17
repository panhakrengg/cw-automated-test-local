import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const webLearnOrgImg = 'weblearn_banner.png'
  const articleListScreen = new ArticleListScreen()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const modifyArticle = new ModifyArticle()

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Help Guide Admin, Org Admin of Demo-Frontier, Org Admin of WebLearn check uploaded file in WebLearn', () => {
      Story.ticket('QA-348')
      context('WebLearn org admin could see its org image', () => {
        adminHelpGuideLogin.signInAsOrgAdminToTab()
        articleListScreen.clickNewArticleButton()
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldSeeBelongOrgImage(webLearnOrgImg)
      })

      context('Help guide admin could not see weblearn org image', () => {
        adminHelpGuideLogin.signInAsAdminToTab()
        articleListScreen.clickNewArticleButton()
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(webLearnOrgImg)
      })

      context('Demo Frontier org admin could not see webLearn org image', () => {
        adminHelpGuideLogin.signInAsFrontierOrgAdminToTab()
        articleListScreen.clickNewArticleButton()
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(webLearnOrgImg)
      })
    })
  })
})
