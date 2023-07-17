import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import { OrgConst } from '../../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, () => {
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  const articleListScreen = new ArticleListScreen()
  const adminArticleModify = new ModifyArticle()

  const webLearnLabel = OrgConst.NAME
  const demoOrgLabel = OrgConst.NAME_DEMO

  beforeEach(() => {
    adminArticleModify.interceptEditor()
  })
  context(Story.adminArticleVerifyCreation, () => {
    it('Org Admin of more than 1 org able to see PROPERTIES', () => {
      Story.ticket('QA-282')
      describe('sign in by organization admin', () => {
        adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
      })
      describe('click new article', () => {
        articleListScreen.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
      })
      describe('verify PROPERTIES', () => {
        const orgInfo = {
          defaultOrg: webLearnLabel,
          totalOrg: 2,
          visibleOrg: [webLearnLabel, demoOrgLabel],
        }
        adminArticleModify.expectTotalProperties(4)
        adminArticleModify.hasManagedBy(orgInfo)
        articleListScreen.selectDropdownOptionByName()
        adminArticleModify.hasVisibility(false)
        adminArticleModify.hasTopics()
        adminArticleModify.hasRoles()
        adminArticleModify.hasFeatureImage('@featuredImageBody', false)
      })
    })
  })
})
