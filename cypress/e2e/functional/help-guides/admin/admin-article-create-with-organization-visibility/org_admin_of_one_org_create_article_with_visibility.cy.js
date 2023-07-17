import Epic from '../../../../../classes/Epic'
import ManageArticle from '../../../../../classes/help-guides/admin/manage-article/ManageArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  let orgName
  let articleTitle
  let manageArticle = new ManageArticle()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  before(() => {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpGuideString) => {
      const helpGuide = YAML.parse(helpGuideString).CreateArticleWithVisibility
      orgName = helpGuide.webLearn.label
      articleTitle = helpGuide.webLearn.admin.articles.organizationAdmin.name.new
    })
  })
  beforeEach(() => {
    adminHelpGuideLogin.signInAsOrgAdminToTab()
    manageArticle.newArticle()
  })
  context(Story.adminArticleCreateWithOrganizationVisibility, () => {
    it('Org Admin not able to see "Managed by"', () => {
      Story.ticket('QA-378')
      manageArticle.expectNotHaveManageBySection()
    })
    it('Create Article by org admin of only one organization', () => {
      Story.ticket('QA-91')
      manageArticle.enterArticleTitle(articleTitle)
      manageArticle.publish()
      manageArticle.verifyArticleManagedByOrganization(orgName, articleTitle)
      manageArticle.goToAdminPage()
      manageArticle.removeAllArticles(articleTitle)
    })
  })
})
