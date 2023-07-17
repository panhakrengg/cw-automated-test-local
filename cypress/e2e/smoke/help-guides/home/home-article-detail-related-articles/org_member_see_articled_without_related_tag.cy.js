import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'

describe(Epic.HelpGuides, () => {
  const articleDetail = new ArticleDetail()
  const defaultVideoTag = 'Video'
  const fakerCriteria = new Faker()
  let articleTags = []
  let articleTitleNoTag = ``

  beforeEach(() => {
    articleDetail.interceptRelatedArticle()
    articleDetail.getArticleDetailData()
    cy.get('@orgMember').then(($orgMember) => {
      articleDetail.visitHasTag($orgMember)
    })
    cy.get('@articleTitleNoTag').then(($articleTitle) => {
      articleTitleNoTag = $articleTitle
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
    it('Org member able to see articles without having related tags on Related Articles', () => {
      Story.ticket('QA-264')
      describe('Visit article that no tag', () => {
        articleDetail.visitWithoutTag()
      })
      describe('Wait related articles ready', () => {
        articleDetail.relatedArticleLabel()
        articleDetail.initRelatedArticle()
        articleDetail.waitRelatedArticle()
      })
      describe('Verify article detail', () => {
        articleDetail.showBackToHelpGuide()
        articleDetail.showDetailTitle(articleTitleNoTag)
        articleDetail.showDetailCopyLink()
        articleDetail.showDetailFeatureImage()
      })
      describe('Verify related articles', () => {
        articleDetail.checkCurrentArticleByTitle()
      })
    })
  })
})
