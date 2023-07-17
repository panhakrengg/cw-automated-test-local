class QuickTip {
  _template

  constructor(quickTipTemplate) {
    this.setTemplate(quickTipTemplate)
  }

  setTemplate(quickTipTemplate) {
    this._template = quickTipTemplate
  }

  verifyQuickTip() {
    cy.get('.tip-wrapper').within(() => {
      this.verifyQuickTipHeader()
      this.verifyQuickTipContent()
      this.verifyQuickTipViewMoreTips()
    })
  }
  verifyQuickTipHeader() {
    cy.get('.tip-head').within(() => {
      cy.get('.tip-icon > img')
        .invoke('attr', 'src')
        .should('contain', this._template['icon'])
      cy.contains('.tip-title', this._template['title']).should('be.visible')
      cy.contains('.tip-header-title', this._template['headerTitle']).should(
        'be.visible'
      )
    })
  }
  verifyQuickTipContent() {
    this._template['tipContents'].forEach((element) => {
      cy.contains(element).should('be.visible')
    })
  }
  verifyQuickTipViewMoreTips() {
    if (!this._template['viewMoreTips']) return
    cy.get('.view-more-tips').as('viewMoreTips')
    cy.get('@viewMoreTips').should(
      'contain.text',
      this._template['viewMoreTips']['label']
    )
    if (!this._template['viewMoreTips']['link']) return
    cy.get('@viewMoreTips')
      .invoke('attr', 'href')
      .should('contain', this._template['viewMoreTips']['link'])
    cy.get('@viewMoreTips').click()
  }
  verifyQuickTipByTitleAndDescription(title, description) {
    cy.cecCard()
      .cardRightContent()
      .within(($rightContent) => {
        cy.wrap($rightContent).hasSvgIcon()
        cy.wrap($rightContent)
          .find('strong')
          .should('contain.text', title)
          .next()
          .should('contain.text', description)
          .find('a')
          .should('have.attr', 'href', '/web/help-guide')
          .parents('.cec-p-4')
          .should('be.visible')
      })
  }
}

export default QuickTip
