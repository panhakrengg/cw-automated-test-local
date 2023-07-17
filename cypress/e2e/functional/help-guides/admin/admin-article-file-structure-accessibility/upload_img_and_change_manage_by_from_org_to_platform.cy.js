import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import UserRole from '../../../../../classes/utilities/user-role/UserRole'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const webLearnOrgImg = 'weblearn_banner.png'
  const articleListScreen = new ArticleListScreen()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleDetail = new ArticleDetail()
  const articleTitle = 'AU Publish article even get warning message (from organization to platform)'

  context(Story.adminArticleFileStructureAccessibility, () => {
    it('Publish article even get warning message (from organization to platform)', () => {
      Story.ticket('QA-352')

      cy.logInTestCase('Reset Data')
      articleListScreen.resetArticle(articleTitle)

      cy.logInTestCase('Create article with upload image to RTE')
      adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
      articleListScreen.clickNewArticleButton()
      articleListScreen.selectDropdownOptionByIndex(2)
      articleListScreen.uploadImageToRTE(webLearnOrgImg)
      articleListScreen.selectDropdownOptionByIndex(1)
      articleListScreen.closeChangeManageByWarning()
      articleListScreen.inputArticleTitle(articleTitle)
      articleListScreen.clickPublishButton()

      cy.logInTestCase('Expected Result')
      articleDetail.expectedUserNotSeeUploadedImg(
        webLearnOrgImg,
        UserRole.CW_USERS.NORMAL_USER,
        articleTitle
      )
      articleDetail.expectedUserSeeUploadedImg(
        webLearnOrgImg,
        UserRole.ORG_MEMBER.NORMAL,
        articleTitle
      )
    })
  })
})
