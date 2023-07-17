import Epic from '../../../../../classes/Epic'
import ArticleListScreen from '../../../../../classes/help-guides/admin/ArticleListScreen'
import ModifyArticle from '../../../../../classes/help-guides/admin/ModifyArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import { OrgConst } from '../../../../../classes/org-management/base-org-management/OrgStub'
import Story from '../../../../../classes/Story'

const adminHelpGuideLogin = new AdminHelpGuideLogin()
const articleListScreen = new ArticleListScreen()
const adminArticleModify = new ModifyArticle()

const platformLabel = 'Platform'
const webLearnLabel = OrgConst.NAME

describe(Epic.HelpGuides, { tags: '@skipPrd' }, () => {
  beforeEach(() => {
    adminArticleModify.interceptEditor()
  })
  context(Story.adminArticleVerifyCreation, () => {
    it('Help Guide Admin able to see PROPERTIES', () => {
      Story.ticket('QA-280')
      describe('sign in by organization admin', () => {
        adminHelpGuideLogin.signInAsAdminToTab()
      })
      describe('click new article', () => {
        articleListScreen.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
      })
      describe('verify PROPERTIES', () => {
        const orgInfo = {
          defaultOrg: platformLabel,
          totalOrg: 1,
          visibleOrg: [platformLabel],
        }
        adminArticleModify.expectTotalProperties(4)
        adminArticleModify.hasManagedBy(orgInfo)
        adminArticleModify.hasVisibility(true)
        adminArticleModify.hasTopics()
        adminArticleModify.hasRoles()
        adminArticleModify.hasFeatureImage('@featuredImageBody', false)
      })
    })
    it('Help Guide-Org Admin able to see PROPERTIES', () => {
      Story.ticket('QA-283')
      describe('sign in by help guide-organization admin', () => {
        adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
      })
      describe('click new article', () => {
        articleListScreen.clickNewArticleButton()
        adminArticleModify.rightContent()
        adminArticleModify.propertiesBody()
      })
      describe('verify PROPERTIES', () => {
        const orgInfo = {
          defaultOrg: platformLabel,
          totalOrg: 2,
          visibleOrg: [platformLabel, webLearnLabel],
        }
        adminArticleModify.expectTotalProperties(4)
        adminArticleModify.hasManagedBy(orgInfo)
        adminArticleModify.hasVisibility(true)
        adminArticleModify.hasTopics()
        adminArticleModify.hasRoles()
        adminArticleModify.hasFeatureImage('@featuredImageBody', false)
      })
    })
  })
})
