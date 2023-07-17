import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const articleDetail = new ArticleDetail()
  const defaultVideoTag = 'Video'
  const fakerCriteria = new Faker()
  let articleTags = []
  let articleTitleHasTag = ``

  beforeEach(() => {
    articleDetail.interceptRelatedArticle()
    articleDetail.getArticleDetailData()
    cy.get('@orgMember').then(($orgMember) => {
      articleDetail.visitHasTag($orgMember)
    })
    cy.get('@articleTitleHasTag').then(($articleTitle) => {
      articleTitleHasTag = $articleTitle
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
    articleDetail.initArticleDetail()
  })

  context(Story.homeArticleDetailRelatedArticles, () => {
    it('Org Member able to view related article area by having related tag', () => {
      Story.ticket('QA-261')
      articleDetail.waitRelatedArticle()
      describe(`Org admin view article detail ${articleTitleHasTag}`, () => {
        articleDetail.showBackToHelpGuide()
        articleDetail.showDetailTags(articleTags)
        articleDetail.showDetailTitle(articleTitleHasTag)
        articleDetail.showDetailFeatureImage()
        articleDetail.showDetailLastUpdate()
        articleDetail.showDetailCopyLink()
        articleDetail.relatedArticleLabel()
      })
      articleDetail.initRelatedArticle()
      describe('Find tags "Security", "Video" and "Learning Admins" in related article', () => {
        cy.get('@firstCard').within(($firstCard) => {
          cy.wrap($firstCard).get('label.border.text-uppercase.text-gray').as('elRelateTags')
          articleDetail.checkRelatedArticleTag(articleTags)
        })
        cy.get('@secondCard').within(($secondCard) => {
          cy.wrap($secondCard).get('label.border.text-uppercase.text-gray').as('elRelateTags')
          articleDetail.checkRelatedArticleTag(articleTags)
        })
        cy.get('@thirdCard').within(($thirdCard) => {
          cy.wrap($thirdCard).get('label.border.text-uppercase.text-gray').as('elRelateTags')
          articleDetail.checkRelatedArticleTag(articleTags)
        })
      })
    })
  })
})
