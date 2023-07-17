class Pagination {
  neighbors(item = 3) {
    cy.get('.pagination')
      .children('li')
      .then(($li) => {
        expect($li).to.have.length.of.at.least(item)
      })
  }
  showItemPerPage(number = 10) {
    cy.get('.entry-dropdown')
      .children('div')
      .then(($div) => {
        cy.get($div.eq(0)).should('have.text', 'Show')
        cy.get($div.eq(1)).should('contain.text', number)
        cy.get($div.eq(2)).should('have.text', 'items per page')
      })
  }
  changePagination(number) {
    cy.get('.pagination').children('li').filter(`:eq(${number})`).click()
  }
  clickTheLastPagination() {
    cy.get('.pagination').within(() => {
      cy.get('.page-item.d-sm-block').last().click()
      cy.waitLoadingOverlayNotExist()
    })
  }
}

export default Pagination
