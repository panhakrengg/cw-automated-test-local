import InterceptReq from '../base/InterceptReq'

class RecommendedHelpGuides {
  _itcRecommended = new InterceptReq('/help-guide/promoted-articles/get', 'RecommendedHelpGuide')

  interceptRecommended() {
    this._itcRecommended.set()
  }
  waitRecommended() {
    this._itcRecommended.wait()
  }

  recommendedHelpGuide() {
    cy.getElementWithLabel(`Recommended help guides`, 'span')
      .parent()
      .parent()
      .as('recommendedHelpGuideBlock')
    cy.get('@recommendedHelpGuideBlock').find('.row > a > .card').as('articleCard')
    cy.get('@recommendedHelpGuideBlock').find('.text-center > a').as('goToHelpGuideLink')
  }

  title() {
    this.recommendedHelpGuide()
    cy.get('@recommendedHelpGuideBlock')
      .find('span')
      .contains('Recommended help guides')
      .scrollIntoView()
  }

  expectArticleCardWithoutData() {
    this.recommendedHelpGuide()
    cy.get('@articleCard')
      .first()
      .within(($article) => {
        cy.wrap($article).find('.image__wrapper > .image__item').should('be.exist')
        cy.wrap($article).find('.card-title').should('be.visible')
        cy.wrap($article).find('.card-text').should('be.visible')
      })
  }

  expectArticleCardWithData(title, description) {
    cy.contains(title)
      .scrollIntoView()
      .parents('div.card')
      .within(($article) => {
        cy.wrap($article)
        cy.wrap($article).find('.image__wrapper > .image__item').should('be.exist')
        cy.wrap($article).find('.card-title').contains(title)
        cy.wrap($article).find('.card-text').contains(description)
      })
  }

  goToHelpGuides() {
    this.recommendedHelpGuide()
    cy.get('@goToHelpGuideLink').within(($helpGuideLink) => {
      cy.wrap($helpGuideLink).contains('Go to Help Guides')
      cy.wrap($helpGuideLink).should('have.attr', 'href', 'javascript:;')
    })
  }

  expectTotalArticle(total) {
    this.recommendedHelpGuide()
    cy.get('@articleCard').should('have.length', total)
  }

  clickGoToHelpGuides() {
    this.recommendedHelpGuide()
    cy.get('@goToHelpGuideLink').click()
  }

  clickArticle(title) {
    cy.contains(title).parents('div.card').find('a').contains(title).click()
  }
  unExpectArticleCardWithData(title, description) {
    this.recommendedHelpGuide()
    cy.get('@articleCard').within(($article) => {
      cy.wrap($article).scrollIntoView()
      cy.wrap($article).find('.image__wrapper > .image__item').should('be.exist')
      cy.wrap($article).find('.card-title').should('not.contain.text', title)
      cy.wrap($article).find('.card-text').should('not.contain.text', description)
    })
  }
}

export default RecommendedHelpGuides
