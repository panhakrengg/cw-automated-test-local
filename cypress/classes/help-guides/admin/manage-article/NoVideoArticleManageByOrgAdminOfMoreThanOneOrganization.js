import AdminHelpGuideLogin from '../../base-help-guides/member-management/AdminHelpGuideLogin'
import NoVideoArticleBase from './NoVideoArticleBase'

class NoVideoArticleManageByOrgAdminOfMoreThanOneOrganization extends NoVideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsAdminTwoOrgToTab()
  }
  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const noVideoArticle = YAML.parse(helpguideString).CreateArticleNotIncludeVideo.admin.articles
      this._existingArticleTitle = noVideoArticle.existingArticle
      this._articleTitle = noVideoArticle.adminTwoOrg.article.name.new
      this._topic = noVideoArticle.role
      this._role = noVideoArticle.topic
    })
  }
}

export default NoVideoArticleManageByOrgAdminOfMoreThanOneOrganization
