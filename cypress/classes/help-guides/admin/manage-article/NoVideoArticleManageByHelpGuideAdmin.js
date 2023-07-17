import Story from '../../../Story'
import NoVideoArticleBase from './NoVideoArticleBase'

class NoVideoArticleManageByHelpGuideAdmin extends NoVideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsAdminToTab()
  }

  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const noVideoArticle = YAML.parse(helpguideString).CreateArticleNotIncludeVideo.admin.articles
      this._existingArticleTitle = noVideoArticle.existingArticle
      this._articleTitle = noVideoArticle.helpGuideAdmin.article.name.new
      this._articleTitleWithTopicAndRole =
        noVideoArticle.helpGuideAdmin.articleWithTopicAndRole.name.new
      this._topic = noVideoArticle.topic
      this._role = noVideoArticle.role
    })
  }

  execute() {
    it('Can not publish article if organization name does not select', () => {
      Story.ticket('QA-68')
      this.newArticle()
      this.enterArticleTitle(this._articleTitle)
      this.selectOrganizationMember()
      this.expectPublishButtonDisabled()
    })
    it('Help Guide Admin create article with Topic and Role', () => {
      Story.ticket('QA-131')
      this.removeAllArticles(this._articleTitleWithTopicAndRole)
      this.newArticle()
      this.enterArticleTitle(this._articleTitleWithTopicAndRole)
      this.selectCategory(this._topic)
      this.selectCategory(this._role)
      this.publish()
      this.expectArticleInAdminArticles(this._articleTitleWithTopicAndRole)
      this.itcAdminHelpGuide.interceptFetchCategories()
      this.adminSidebar('Topics')
      this.itcAdminHelpGuide.waitFetchCategories()
      this.expectCategoryWithArticleNumber(this._topic, 1)
      this.adminSidebar('Roles')
      this.itcAdminHelpGuide.waitFetchCategories()
      this.expectCategoryWithArticleNumber(this._role, 1)
      this.goToHomePage()
      this.expectArticleInHomePage(this._articleTitleWithTopicAndRole)
      this.removeAllArticlesInAdminPageWith(this._articleTitleWithTopicAndRole)
    })
    it('Article able to create duplicate', () => {
      Story.ticket('QA-136')
      this.removeAllArticles(this._existingArticleTitle)
      this.createNewArticleWith(this._existingArticleTitle)
      this.createNewArticleWith(this._existingArticleTitle)
      this.expectDuplicateArticleInAdminArticles(this._existingArticleTitle)
      this.removeAllArticles(this._existingArticleTitle)
    })
    super.execute()
  }
}

export default NoVideoArticleManageByHelpGuideAdmin
