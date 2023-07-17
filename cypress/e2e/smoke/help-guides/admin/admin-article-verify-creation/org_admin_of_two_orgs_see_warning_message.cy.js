import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, () => {
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const adminArticleModify = new ModifyArticle()

  const webLearnOrgImg = 'weblearn_banner.png'

  beforeEach(() => {
    adminArticleModify.interceptEditor()
  })

  context(Story.helpGuidesAdminFileStructureAndAccessibility, () => {
    it('Org Admin of 2 organizations able to see "Warning" message displays', () => {
      Story.ticket('QA-351')
      adminHelpGuideLogin.signInAsAdminTwoOrgToTab()

      cy.logInTestCase('Upload image to RTE')
      articleListScreen.clickNewArticleButton()
      articleListScreen.selectDropdownOptionByName()
      articleListScreen.uploadImageToRTE(webLearnOrgImg)

      cy.logInTestCase('Change manage by')
      articleListScreen.selectDropdownOptionByName('Demo')

      cy.logInTestCase('Expected result')
      articleListScreen.showManageByWarningModal()
    })
  })
})
