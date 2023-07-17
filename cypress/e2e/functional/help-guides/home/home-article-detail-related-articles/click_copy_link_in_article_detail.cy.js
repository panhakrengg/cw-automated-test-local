import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'
import YamlHelper from '../../../../../classes/utilities/YamlHelper'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  context(Story.homeArticleDetailRelatedArticles, () => {
    const articleDetail = new ArticleDetail()
    const faker = new Faker()

    before(() => {
      new YamlHelper('help-guide').read().then(({ CopyLink }) => {
        const webLearn = CopyLink.webLearn
        faker.setPathFixture(webLearn.articleDetail)
        faker.getFixtureUrlId(0, 'articleId')
        faker.setPathFixture(webLearn.articleDetail.languageCode)
        faker.getFixtureValue('languageCode')
        faker.setPathFixture(webLearn.viewBy.organizationMember)
        faker.getFixtureValue('userRole')
      })
    })

    it('Click copy link in article detail', () => {
      Story.ticket('QA-256')
      cy.get('@articleId').then((articleId) => {
        articleDetail.visitArticleDetail(articleId)
        articleDetail.checkCopyLink(articleId)
      })
    })
  })
})
