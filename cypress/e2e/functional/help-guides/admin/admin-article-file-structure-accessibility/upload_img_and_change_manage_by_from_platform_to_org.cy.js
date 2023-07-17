import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const platformOrgImg = 'platform_changeAccountEmail.png'
  const articleListScreen = new ArticleListScreen()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleDetail = new ArticleDetail()
  const articleTitle = 'AU Publish article even get warning message (from platform to organization)'

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Publish article even get warning message (from platform to organization)', () => {
      Story.ticket('QA-379')

      cy.logInTestCase('Reset Data')
      articleListScreen.resetArticle(articleTitle)

      cy.logInTestCase('Create article with upload image to RTE')
      adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
      articleListScreen.clickNewArticleButton()
      articleListScreen.uploadImageToRTE(platformOrgImg)
      articleListScreen.selectDropdownOptionByIndex(2)
      articleListScreen.closeChangeManageByWarning()
      articleListScreen.inputArticleTitle(articleTitle)
      articleListScreen.clickPublishButton()

      cy.logInTestCase('Expected Result')
      articleDetail.expectedUserNotSeeArticle('CWUsers.allLogin', articleTitle)
      articleDetail.expectedUserSeeUploadedImg(
        platformOrgImg,
        UserRole.ORG_MEMBER.NORMAL,
        articleTitle
      )
    })
  })
})
