import Story from '../../../Story'
import NoVideoArticleBase from './NoVideoArticleBase'

class NoVideoArticleManageByOrgAdminOfOneOrganizationOnly extends NoVideoArticleBase {
  logIn() {
    this.adminHelpGuideLogin.signInAsOrgAdminToTab()
  }

  before() {
    cy.readFile('cypress/fixtures/help-guide.yaml').then((helpguideString) => {
      const noVideoArticle = YAML.parse(helpguideString).CreateArticleNotIncludeVideo.admin.articles
      this._existingArticleTitle = noVideoArticle.existingArticle
      this._articleTitle = noVideoArticle.organizationAdmin.article.name.new
      this._articleTitleWithTopic = noVideoArticle.organizationAdmin.articleWithTopic.name.new
      this._topic = noVideoArticle.topic
      this._role = noVideoArticle.role
    })
  }

  execute() {
    it('Org Admin create article with Topic', () => {
      //Org Admin create an article and select a topic
      Story.ticket('QA-134')
      this.removeAllArticles(this._articleTitleWithTopic)
      this.newArticle()
      this.enterArticleTitle(this._articleTitleWithTopic)
      this.selectCategory(this._topic)
      this.publish()
      this.expectArticleInAdminArticles(this._articleTitleWithTopic)
      this.goToHomePage()
      this.expectArticleInHomePage(this._articleTitleWithTopic)

      //HelpGide Admin verify the topic count should not increased
      cy.signOut()
      this.adminHelpGuideLogin.signInAsAdminToTab()
      this.itcAdminHelpGuide.interceptFetchCategories()
      this.adminSidebar('Topics')
      this.itcAdminHelpGuide.waitFetchCategories()
      this.expectCategoryWithArticleNumber(this._topic, 0)

      //HelpGuide Admin and Org Admin verify the topic count should increase by 1
      cy.signOut()
      this.adminHelpGuideLogin.signInAsAdminAndOrgAdminToTab()
      this.itcAdminHelpGuide.interceptFetchCategories()
      this.adminSidebar('Topics')
      this.itcAdminHelpGuide.waitFetchCategories()
      this.expectCategoryWithArticleNumber(this._topic, 1)
      this.goToAdminPage()
      this.removeAllArticles(this._articleTitleWithTopic)
    })
    super.execute()
  }
}

export default NoVideoArticleManageByOrgAdminOfOneOrganizationOnly
