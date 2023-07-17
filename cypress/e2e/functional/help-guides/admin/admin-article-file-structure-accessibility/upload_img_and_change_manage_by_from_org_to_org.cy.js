import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const webLearnOrgImg = 'weblearn_banner.png'
  const articleListScreen = new ArticleListScreen()
  const articleDetail = new ArticleDetail()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()

  const articleTitle =
    'AU Publish article even get warning message (from organization to another organization)'

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Publish article even get warning message (from organization to another organization)', () => {
      Story.ticket('QA-369')

      cy.logInTestCase('Reset data')
      articleListScreen.resetArticle(articleTitle)

      cy.logInTestCase('Create article with upload image to RTE')
      adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
      articleListScreen.clickNewArticleButton()
      articleListScreen.uploadImageToRTE(webLearnOrgImg)
      articleListScreen.selectDropdownOptionByIndex(2)
      articleListScreen.closeChangeManageByWarning()
      articleListScreen.inputArticleTitle(articleTitle)
      articleListScreen.clickPublishButton()

      cy.logInTestCase('Expected Result')
      articleDetail.expectedUserNotSeeArticle(UserRole.ORG_MEMBER.NORMAL, articleTitle)
      articleDetail.expectedUserSeeUploadedImg(
        webLearnOrgImg,
        UserRole.ORG_ADMIN.TWO_ORGANIZATION,
        articleTitle
      )
    })
  })
})
