class QuickTip {
  title(title) {
    cy.get('.tip-title').should('contain.text', 'Quick Tip')
    cy.get('.tip-header-title').should('contain.text', title)
  }
  secondaryTitle(title) {
    cy.get('.tip-title').should('contain.text', 'Quick Tip')
    cy.get('.tip-lp').should('contain.text', title)
  }
  desc(text) {
    cy.get('.tip-description').should('contain.text', text)
  }
  listContain(text, index = 0) {
    cy.get('.tip-description li').eq(index).should('contain.text', text)
  }
  hasMoreTipsLink() {
    cy.get('.view-more-tips')
      .should('be.visible')
      .invoke('attr', 'href')
      .then(($url) => {
        expect($url).to.be.include('/web/help-guide')
      })
  }
  clickOnEntryLink(label, tag) {
    cy.getElementWithLabel(label, tag).first().parent().click()
  }
  clickOnViewMoreLink(label, tag) {
    cy.getElementWithLabel(label, tag).click()
  }
}

export default QuickTip
