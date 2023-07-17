class CardPanelTwoColumn {
  title(text) {
    cy.get('.cec-card__title span').should('contain.text', text)
  }
}

export default CardPanelTwoColumn
