export default class PostQuery {
  getQuickPostByContent(content) {
    cy.get('#_PostActivityWeb_activityFeed').then(() => {
      cy.getElementWithLabel(content, '.cec-card__content')
        .parents('.cec-card--activity-post')
        .as('quickPost')
    })
    return cy.get('@quickPost')
  }

  getTotalQuickPostWithContent(content) {
    cy.wrap(0).as('totalQuickPost')
    cy.get('.post-activity-feed-wrapper').then(($postActivity) => {
      const total = $postActivity.find(`p:contains("${content}")`).length
      if (total) {
        cy.wrap(total).as('totalQuickPost')
      }
    })
    return cy.get('@totalQuickPost')
  }

  getCommentWrapper() {
    return cy.get('.cec-activity-post')
  }

  getButtonAddComment() {
    return cy.get('.btn-send-msg')
  }

  getIconShare() {
    cy.get('.cec-card__action-row').within(() => {
      cy.get('.cec-card__action a').eq(2).as('iconShare')
    })
    return cy.get('@iconShare')
  }

  getIconComment() {
    cy.get('.cec-card__body > div > .cec-card__action-row').within(() => {
      cy.get('.cec-card__action a').eq(1).as('iconComment')
    })
    return cy.get('@iconComment')
  }
}
