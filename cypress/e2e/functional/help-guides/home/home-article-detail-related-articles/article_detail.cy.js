import Epic from '../../../../../classes/Epic'
import ArticleDetail from '../../../../../classes/help-guides/home/ArticleDetail'
import Story from '../../../../../classes/Story'
import Faker from '../../../../../classes/utilities/Faker'
import HelpGuideFixture from '../../../../../classes/utilities/HelpGuideFixture'

describe(Epic.HelpGuides, { retries: 1 }, () => {
  const articleDetail = new ArticleDetail()
  const fakerCriteria = new Faker()

  context(Story.homeArticleDetailRelatedArticles, () => {
    const defaultVideoTag = 'Video'
    let articleTitleHasTag = ``
    let articleTitleNoTag = ``
    let articleTags = []
    beforeEach(() => {
      articleDetail.interceptRelatedArticle()
      articleDetail.getArticleDetailData()
      cy.get('@orgMember').then(($orgMember) => {
        articleDetail.visitHasTag($orgMember)
      })
      cy.get('@articleTitleHasTag').then(($articleTitle) => {
        articleTitleHasTag = $articleTitle
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

    it('Click Back to Help Guide from view detail', () => {
      Story.ticket('QA-263')
      articleDetail.clickBackToHelpGuide()
      articleDetail.initNavigationWrapper()
      articleDetail.hasNavigationWrapper()
      articleDetail.showDefaultTenArticles()
    })
  })

  context('Home - Article Detail & Related Articles', () => {
    const helpGuideFixture = new HelpGuideFixture()
    let orgMember = ``
    let articleIdForYoutubeVideo = ``
    let articleIdForVimeoVideo = ``
    let articleIdForUploadVideo = ``
    let youtubeTitle = ``
    let vimeoTitle = ``

    before(() => {
      helpGuideFixture.getPlayVideoData()
      cy.get('@orgMember').then(($user) => {
        orgMember = $user
      })
      cy.get('@articleIdForYoutubeVideo').then(($id) => {
        articleIdForYoutubeVideo = $id
      })
      cy.get('@articleIdForVimeoVideo').then(($id) => {
        articleIdForVimeoVideo = $id
      })
      cy.get('@articleIdForUploadVideo').then(($id) => {
        articleIdForUploadVideo = $id
      })
      cy.get('@youtubeTitle').then(($title) => {
        youtubeTitle = $title
      })
      cy.get('@vimeoTitle').then(($title) => {
        vimeoTitle = $title
      })
    })

    it('View article YouTube video to make sure the embedded plays', () => {
      Story.ticket('QA-400')
      articleDetail.open(articleDetail.getUrl(articleIdForYoutubeVideo), orgMember)
      articleDetail.clickVideoPlayIcon()
      articleDetail.getIframeBodyByTitle(youtubeTitle)
      articleDetail.expectedYoutubeVideoIsAbleToPlay()
    })

    it('View article Vimeo video to make sure the embedded plays', () => {
      Story.ticket('QA-401')
      articleDetail.open(articleDetail.getUrl(articleIdForVimeoVideo), orgMember)
      articleDetail.clickVideoPlayIcon()
      articleDetail.waitRenderingVideo(3000)
      articleDetail.getIframeBodyByTitle(vimeoTitle)
      articleDetail.expectedVimeoVideoIsAbleToPlay()
    })

    it('View article uploaded video to make sure the embedded plays', () => {
      Story.ticket('QA-402')
      articleDetail.open(articleDetail.getUrl(articleIdForUploadVideo), orgMember)
      articleDetail.clickVideoPlayIcon()
      articleDetail.waitRenderingVideo(1000)
      articleDetail.expectedUploadedVideoIsAbleToPlay()
    })
  })
})
