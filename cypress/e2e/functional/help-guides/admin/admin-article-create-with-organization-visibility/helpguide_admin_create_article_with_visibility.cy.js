const YAML = require('yamljs')
import Epic from '../../../../../classes/Epic'
import ManageArticle from '../../../../../classes/help-guides/admin/manage-article/ManageArticle'
import AdminHelpGuideLogin from '../../../../../classes/help-guides/base-help-guides/member-management/AdminHelpGuideLogin'
import Story from '../../../../../classes/Story'
import SignInAs from '../../../../../classes/utilities/SignInAs'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  let platform
  let articleVisibilityAllUsers
  let articleVisibilityOrganization
  let manageArticle = new ManageArticle()
  const adminHelpGuideLogin = new AdminHelpGuideLogin()
  before(() => {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpGuideString) => {
      const helpGuide = YAML.parse(helpGuideString).CreateArticleWithVisibility
      platform = helpGuide.platForm.label
      articleVisibilityAllUsers = helpGuide.platForm.visibility.allUsers.admin.articles.name.new
      articleVisibilityOrganization =
        helpGuide.platForm.visibility.organizationMember.admin.articles.name.new
    })
  })
  beforeEach(() => {
    adminHelpGuideLogin.signInAsAdminToTab()
    manageArticle.newArticle()
  })
  context(Story.adminArticleCreateWithOrganizationVisibility, () => {
    it('Help Guide Admin able to see Managed by section and Org Visibility', () => {
      Story.ticket('QA-376')
      manageArticle.expectToHaveManageBySection()
      manageArticle.expectToHaveOrganizationVisibility()
    })
    it('Create Article with Managed by "Platform" and Visibility "All Users"', () => {
      Story.ticket('QA-87')
      manageArticle.enterArticleTitle(articleVisibilityAllUsers)
      manageArticle.publish()
      manageArticle.expectArticleInAdminArticles(articleVisibilityAllUsers)
      manageArticle.expectManageBy(platform)
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityAllUsers)

      SignInAs.reSignInAsOrgAdmin()
      manageArticle.goToAdminPage()
      manageArticle.expectArticleNotInAdminArticles(articleVisibilityAllUsers)
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityAllUsers)

      SignInAs.reSignInAsOrgMember()
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityAllUsers)

      SignInAs.reSignInAsCwNormalUser()
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityAllUsers)

      SignInAs.reSignInAsHelpGuideAdmin()
      manageArticle.goToAdminPage()
      manageArticle.removeAllArticles(articleVisibilityAllUsers)
    })
    it('Create Article with Managed by "Platform" and Visibility "<organization name>"', () => {
      Story.ticket('QA-89')
      manageArticle.enterArticleTitle(articleVisibilityOrganization)
      manageArticle.selectOrganizationMember()
      manageArticle.selectOrganization()
      manageArticle.publish()
      manageArticle.expectArticleInAdminArticles(articleVisibilityOrganization)
      manageArticle.expectManageBy(platform)
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityOrganization)

      SignInAs.reSignInAsOrgAdmin()
      manageArticle.goToAdminPage()
      manageArticle.expectArticleNotInAdminArticles(articleVisibilityOrganization)
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityOrganization)

      SignInAs.reSignInAsOrgMember()
      manageArticle.goToHomePage()
      manageArticle.expectArticleInHomePage(articleVisibilityOrganization)

      SignInAs.reSignInAsCwUser()
      manageArticle.goToHomePage()
      manageArticle.expectArticleNotInHomePage(articleVisibilityOrganization)

      SignInAs.reSignInAsHelpGuideAdmin()
      manageArticle.goToAdminPage()
      manageArticle.removeAllArticles(articleVisibilityOrganization)
    })
  })
})
