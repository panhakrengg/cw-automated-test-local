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
      articleTitle = helpGuide.webLearn.admin.articles.adminTwoOrg.name.new
    })
  })
  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
    manageArticle.newArticle()
  })
  context(Story.adminArticleCreateWithOrganizationVisibility, () => {
    it('Org Admin of 2 organizations able to see "Managed by", but no "Org Visibility"', () => {
      Story.ticket('QA-377')
      manageArticle.expectToHaveManageBySection()
      manageArticle.expectNotHaveOrgVisibility()
    })
    it('Create Article with Managed by "<organization name>"', () => {
      Story.ticket('QA-90')
      manageArticle.enterArticleTitle(articleTitle)
      manageArticle.selectManagedByOrganization(orgName)
      manageArticle.publish()
      manageArticle.verifyArticleManagedByOrganization(orgName, articleTitle)
      adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
      manageArticle.goToAdminPage()
      manageArticle.removeAllArticles(articleTitle)
    })
  })
})
