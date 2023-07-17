import Epic from '../../../../../classes/Epic'
import AdminHelpGuide from '../../../../../classes/help-guides/admin/AdminHelpGuide'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  const platformOrgImg = 'platform_changeAccountEmail.png'
  const webLearnOrgImg = 'weblearn_banner.png'
  const demoFrontierOrgImg = '2021-profile-WhatsApp-hd.jpg'
  const articleListScreen = new ArticleListScreen()
  const modifyArticle = new ModifyArticle()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Help Guide Admin and also Org Admin of 2 organizations able to view file', () => {
      Story.ticket('QA-350')
      describe('Sign in and go to create article creation as help guide-org admin of 2 orgs', () => {
        adminHelpGuideLogin.signInAsHelpGuideTwoOrgAdminToTab()
        articleListScreen.clickNewArticleButton()
      })
      context('Platform', () => {
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldSeeBelongOrgImage(platformOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(webLearnOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(demoFrontierOrgImg)
        modifyArticle.clickCloseIcon()
      })

      context('WebLearn org', () => {
        articleListScreen.selectDropdownOptionByIndex(2)
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldSeeBelongOrgImage(webLearnOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(platformOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(demoFrontierOrgImg)
        modifyArticle.clickCloseIcon()
      })

      context('Demo Frontier org', () => {
        articleListScreen.selectDropdownOptionByIndex(3)
        articleListScreen.getImageSelectorContainer()
        modifyArticle.expectedUserCouldSeeBelongOrgImage(demoFrontierOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(platformOrgImg)
        modifyArticle.expectedUserCouldNotSeeNotBelongOrgImage(webLearnOrgImg)
      })
    })
  })
})
