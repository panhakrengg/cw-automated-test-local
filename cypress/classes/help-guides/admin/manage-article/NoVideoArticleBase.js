import Story from '../../../Story'
import ManageArticle from './ManageArticle'

class NoVideoArticleBase extends ManageArticle {
  _existingArticleTitle
  _articleTitle
  _articleTitleWithTopicAndRole
  _articleTitleWithTopic
  _topic
  _role

  logIn() {
    throw new Error('You have to implement the method logIn!')
  }

  before() {
    throw Error('You have to implement the method before to fetch mockup data!')
  }

  execute() {
    before(() => {
      this.before()
    })
    beforeEach(() => {
      this.itcAdminHelpGuide.interceptList()
      this.logIn()
    })
    it('Required field on Article Title', () => {
      Story.ticket('QA-69')
      this.newArticle()
      this.expectPublishButtonDisabled()
      this.enterArticleTitle(this._articleTitle)
      this.expectPublishButtonEnabled()
    })
    it('Article without include a Video', () => {
      Story.ticket('QA-70')
      this.newArticle()
      this.enterArticleTitle(this._articleTitle)
      this.publish()
      this.expectArticleInAdminArticles(this._articleTitle)
      this.goToHomePage()
      this.expectArticleInHomePage(this._articleTitle)
      this.goToAdminPage()
      this.removeAllArticles(this._articleTitle)
    })
  }
}

export default NoVideoArticleBase
