import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const articleDetail = new ArticleDetail()
  const fakerCriteria = new Faker()
  const defaultVideoTag = 'Video'
  let articleTags = []
  beforeEach(() => {
    articleDetail.getArticleDetailData()
    articleDetail.interceptRelatedArticle()
    cy.get('@orgMember').then(($orgMember) => {
      articleDetail.visitHasTag($orgMember)
    })
    cy.get('@articleTags').then(($articleTags) => {
      for (let index in $articleTags) {
        const isDefaultVideoTag = defaultVideoTag == $articleTags[index]
        articleTags.push(
          isDefaultVideoTag
            ? defaultVideoTag
            : fakerCriteria.getAuTextNotDelete($articleTags[index])
        )
      }
    })
    articleDetail.getRelatedArticle()
  })
  context(Story.homeArticleDetailRelatedArticles, () => {
    it('Click to view article in related article area', () => {
      Story.ticket('QA-262')
      articleDetail.waitRelatedArticle()
      articleDetail.initRelatedArticle()
      describe('View a related article have article tag "Security", "Video" or "Learning Admins"', () => {
        cy.get('@thirdCard').within(($thirdCard) => {
          cy.wrap($thirdCard).get('label.border.text-uppercase.text-gray').as('elRelateTags')
          articleDetail.checkRelatedArticleTag(articleTags)
        })
        articleDetail.clickRelatedArticle()
        articleDetail.checkRelatedArticleDetail()
      })
    })
  })
})
