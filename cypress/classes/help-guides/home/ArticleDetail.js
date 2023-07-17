import InterceptReq from '../../base/InterceptReq'
import Field from '../../constants/Field'
import ClipboardHelper from '../../utilities/ClipboardHelper'
import HelpGuidesHome from './HelpGuidesHome'

class ArticleDetail extends HelpGuidesHome {
  _itcRelatedArticle = new InterceptReq('/related_article/get', 'RelatedArticle')
  _itcFetchArticleDetail = new InterceptReq('/help-guide/detail/fetch', 'FetchArticleDetail')

  constructor() {
    super()
    this.helpGuideHome = new HelpGuidesHome()
  }
  interceptRelatedArticle() {
    this._itcRelatedArticle.set()
  }
  waitRelatedArticle() {
    this._itcRelatedArticle.wait()
  }

  initRelatedArticle() {
    cy.get('@related').find('.cec-p-md-4 > .card').as('relatedArticle')
    cy.get('@relatedArticle').find('a').as('allRelatedTitles')
    cy.get('@relatedArticle').first().as('firstCard')
    cy.get('@firstCard').next().as('secondCard')
    cy.get('@secondCard').next().as('thirdCard')

    cy.get('@relatedArticle')
      .find('label.border.text-uppercase.text-gray')
      .as('allTagRelatedArticle')
  }

  checkRelatedArticleTag(articleTags) {
    cy.get('@elRelateTags').each(($elRelateTag, $elRelateTagIndex, $elRelateTags) => {
      for (let articleTagIndex in articleTags) {
        const tagRelateText = $elRelateTag.text().trim()
        const articleTagText = articleTags[articleTagIndex]
        const isRelateTagFound = tagRelateText == articleTagText
        if (isRelateTagFound) {
          this.relatedCardHasTag(tagRelateText)
          cy.get($elRelateTag).as('elRelatedTag')
          cy.get($elRelateTag).parent('div').get('a').as('elRelateTitle')
          return false
        }
        const isRelateTagNotFound =
          tagRelateText != articleTagText &&
          articleTags.length - 1 == articleTagIndex &&
          $elRelateTags.length - 1 == $elRelateTagIndex
        if (isRelateTagNotFound) {
          expect(tagRelateText).equal(articleTagText)
        }
      }
    })
  }

  relatedCardHasTag(cardTag) {
    cy.contains(cardTag).and('be.visible')
  }

  clickRelatedArticle() {
    cy.get('@elRelateTitle').click()
  }

  viewStaticData() {
    this.waitRelatedArticle()
    this.expectBackToHelpGuide()
    this.articleData()
    this.relatedArticleBlock()
  }

  getUrl(id) {
    return `web/help-guide/home?p_p_id=helpGuidePortlet&p_p_lifecycle=0&_helpGuidePortlet_mvcRenderCommandName=/post/detail&_helpGuidePortlet_id=${id}&p_p_state=maximized`
  }

  visitHasTag(role) {
    cy.get('@articleUrlIdHasTag').then((id) => {
      this.open(this.getUrl(id), role)
    })
  }

  visitWithoutTag() {
    cy.get('@articleUrlIdNoTag').then((id) => {
      cy.visit(this.getUrl(id))
    })
  }

  visitFromPlatform(role) {
    cy.get('@articlePlatform').then((id) => {
      this.open(this.getUrl(id), role)
    })
  }

  visitFromWebLearn(role) {
    cy.get('@articleWebLearn').then((id) => {
      this.open(this.getUrl(id), role)
    })
  }

  visitArticleDetail(id) {
    this._itcFetchArticleDetail.set()
    cy.get('@userRole').then(($role) => {
      this.open(this.getUrl(id), $role)
    })
    this._itcFetchArticleDetail.wait()
  }

  expectBackToHelpGuide() {
    cy.get('.cec-card__header > a').within(($backHelpGuide) => {
      cy.wrap($backHelpGuide).hasSvgIcon()
      cy.wrap($backHelpGuide).hasLinkWithSpan('Back to Help Guide')
    })
  }

  articleData() {
    //on article 'Create organization community of purpose'
    cy.get('.cec-px-5.cec-px-sm-6').within(($article) => {
      cy.wrap($article).find('h1.font-size-28').contains('Create organization community of purpose')

      cy.wrap($article).find(':nth-child(1)>label').as('categoryLabel')
      cy.get('@categoryLabel').contains('Communities of Purpose')
      cy.get('@categoryLabel').contains('Learning Admins')

      cy.wrap($article).find('.image__item').should('be.visible')

      cy.wrap($article)
        .find('.justify-content-between')
        .within(($lastUpdate) => {
          cy.wrap($lastUpdate).find('span').contains('Last updated')
          cy.wrap($lastUpdate).find('[role="button"] > span').contains('Copy link')
        })

      cy.wrap($article)
        .get('.cec-mt-5')
        .within(($description) => {
          cy.wrap($description).find('h1').contains('Steps')
          cy.wrap($description).find('ol > li').as('steps')
          cy.get('@steps').eq(0).contains('Sign in to system as Community Creator')
          cy.get('@steps').eq(1).contains('Click My Communities in Global Menu')
          cy.get('@steps').eq(2).contains('Click Create Community of Purpose')
          cy.get('@steps').eq(3).contains('Select Organization Community')
          cy.get('@steps').eq(4).contains('Click Next until fill all info')
          cy.get('@steps').eq(4).find('strong').contains(Field.NEXT)
          cy.wrap($description).find('h2').contains('Expected result')
          cy.wrap($description)
            .find('p')
            .first()
            .within(($expected) => {
              cy.wrap($expected).contains(
                'It will display Congratulation screen with 2 button Go to My New Community and Go to My Community List'
              )
              cy.wrap($expected).find('em').contains('Go to My New Community')
              cy.wrap($expected).find('u').contains('Go to My Community List')
            })
          cy.wrap($description).hasLink('Crosswired', 'https://crosswired.com/')
          cy.wrap($description).find('ul > li').as('stepImage')
          cy.get('@stepImage').find('img').should('have.length', '6')
          cy.get('@stepImage').eq(0).contains('First, select "Organization"')
          cy.get('@stepImage').eq(1).contains('Fill organization information')
          cy.get('@stepImage').eq(2).contains('Add community banner')
          cy.get('@stepImage').eq(3).contains('After creating, will get Congratulation!')
          cy.get('@stepImage').eq(3).find('strong').contains('Congratulation!')
          cy.get('@stepImage').eq(4).contains('The new community will list in My Communities page')
          cy.get('@stepImage').eq(5).contains('Enjoy with new community')
        })
    })
  }

  relatedArticleBlock() {
    this.relatedArticleLabel()
    this.relatedArticleCard()
  }

  getRelatedArticle() {
    cy.get('.cec-card__right-content').as('related')
  }

  relatedArticleLabel() {
    this.getRelatedArticle()
    cy.get('@related')
      .find('.text-capitalize.font-size-16')
      .contains('Related Articles')
      .should('be.visible')
  }

  relatedArticleCard() {
    this.getRelatedArticle()
    cy.get('@related').get('.cec-p-md-4').first().find('.card').should('have.length', '3')
  }
  clickBackToHelpGuide() {
    cy.cecCard().cardMainContent().contains('Back to Help Guide').parent().find('a').click()
  }

  initArticleDetail() {
    cy.cecCard().cardMainContent().children('div:last()').as('articleDetail')
    cy.get('@articleDetail').first().children('div:first()').as('articleDetailTags')
    cy.get('@articleDetail').get('h1').as('articleDetailTitle')
    cy.get('@articleDetailTitle').next().as('articleDetailFeatureImg')
    cy.get('@articleDetailFeatureImg').next().children('span').as('articleDetailLastUpdate')
    cy.get('@articleDetailLastUpdate').get('div[role="button"]').as('articleDetailCopyLink')
  }

  checkRelatedArticleDetail() {
    cy.get('@elRelateTitle').then(($elRelateTitle) => {
      cy.get('@elRelatedTag').then(($elRelatedTag) => {
        const title = $elRelateTitle.text().trim()
        const tagNames = [$elRelatedTag.text().trim()]
        this.waitRelatedArticle()
        this.initArticleDetail()
        this.showBackToHelpGuide()
        this.showDetailTags(tagNames)
        this.showDetailTitle(title)
        this.showDetailFeatureImage()
        this.showDetailLastUpdate()
        this.showDetailCopyLink()
        this.relatedArticleLabel()
      })
    })
  }

  showDetailTags(tagNames) {
    cy.get(tagNames).each((tagName) => {
      cy.get('@articleDetailTags')
        .find('.border.text-uppercase')
        .contains(tagName)
        .should('be.visible')
    })
  }

  showDetailTitle(article) {
    cy.cecCard()
      .cardMainContent()
      .children('div:last()')
      .get('h1')
      .contains('.font-size-28.font-weight-bold', article)
      .should('be.visible')
  }

  showDetailFeatureImage() {
    cy.get('@articleDetailFeatureImg').should('be.visible')
  }

  showDetailLastUpdate() {
    cy.get('@articleDetailLastUpdate').should('contain.text', 'Last updated').and('be.visible')
  }

  showDetailCopyLink() {
    cy.get('@articleDetailCopyLink').should('contain.text', 'Copy link').and('be.visible')
  }

  showBackToHelpGuide() {
    cy.cecCard().cardMainContent().contains('Back to Help Guide').and('be.visible')
  }

  checkCurrentArticleByTitle() {
    cy.get('@allRelatedTitles').then(($relatedTitles) => {
      cy.get($relatedTitles).its('length').should('eq', 3)
      cy.get($relatedTitles).each(($relateTitle) => {
        cy.get($relateTitle).should('be.visible')
      })
    })
  }
  clickVideoPlayIcon() {
    cy.get('.preview-popup-wrapper > a').click()
  }
  waitRenderingVideo(time) {
    cy.wait(time)
  }
  getIframeBodyByTitle(iframeTitle) {
    return cy.get(`iframe[title="${iframeTitle}"]`).getIframeBody().as('iframeBody')
  }
  expectedYoutubeVideoIsAbleToPlay() {
    cy.get('@iframeBody')
      .find('#player')
      .should('exist')
      .within(($player) => {
        cy.wrap($player)
          .find('button[aria-label="Play"]')
          .its('length')
          .then((res) => {
            if (res > 0) {
              cy.wrap($player).get('button[aria-label="Play"]').click({ force: true })
            }
          })
        cy.get('div[aria-label="YouTube Video Player"]').should('exist')
        cy.get('div.playing-mode').should('exist')
      })
  }
  expectedVimeoVideoIsAbleToPlay() {
    cy.get('@iframeBody')
      .find('#player')
      .should('exist')
      .within(() => {
        cy.get('div.vp-player-ui-overlays > .vp-title').should(
          'have.attr',
          'style',
          'display: none;'
        )
      })
  }
  expectedUploadedVideoIsAbleToPlay() {
    cy.get('#videoUploadPlayer')
      .invoke('prop', 'paused')
      .then(($pause) => {
        expect($pause).to.be.false
      })
  }

  checkCopyLink(articleId) {
    cy.get('div[role="button"]').contains('span', 'Copy link').parent().as('copyLinkBtn')
    cy.get('@languageCode').then((code) => {
      const copyLink = `${Cypress.config(
        'baseUrl'
      )}/web/help-guide/home?p_p_id=helpGuidePortlet&p_p_lifecycle=0&_helpGuidePortlet_mvcRenderCommandName=%2Fpost%2Fdetail&_helpGuidePortlet_id=${articleId}&p_p_state=maximized&_helpGuidePortlet_languageId=${code}`
      ClipboardHelper.expectClipboardValueEqual(copyLink, this.validateCopyLinkButton)
    })
  }

  validateCopyLinkButton() {
    cy.get('@copyLinkBtn').hasSvgIcon()
    cy.get('@copyLinkBtn').realClick()
    cy.get('.cw-btn-icon').should('have.class', 'disabled').and('contain.text', 'Copied!')
    cy.wait(3000)
    cy.get('@copyLinkBtn').should('not.have.class', 'disabled').and('contain.text', 'Copy link')
    cy.expectToastMessage('Link copied to clipboard.')
  }
  expectedUserNotSeeUploadedImg(imageTitle, role, articleTitle) {
    this.helpGuideHome.signInBy(role)
    this.helpGuideHome.clickArticle(articleTitle)
    this.getImgFromArticleContent(imageTitle, articleTitle).should('not.be.visible')
  }
  expectedUserSeeUploadedImg(imageTitle, role, articleTitle) {
    this.helpGuideHome.signInBy(role)
    this.helpGuideHome.clickArticle(articleTitle)
    this.getImgFromArticleContent(imageTitle, articleTitle).should('be.visible')
  }
  expectedUserNotSeeArticle(role, articleTitle) {
    this.helpGuideHome.signInBy(role)
    this.helpGuideHome.searchArticleByEnter(articleTitle)
    this.helpGuideHome.emptyResult()
  }
  getImgFromArticleContent(imageTitle, articleTitle) {
    cy.get(`h1:contains('${articleTitle}')`)
      .parent()
      .get(`.cec-mt-5 img[src*="${imageTitle}"]`)
      .as('image')
    return cy.get('@image')
  }
}

export default ArticleDetail
