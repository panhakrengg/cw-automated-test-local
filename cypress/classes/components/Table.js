class Table {
  _selector
  constructor(selector) {
    this._selector = selector
  }
  getCellTextAsArray(columnIndex, exceptRowIndex = '') {
    let cellContents = []
    return new Cypress.Promise((resolve) => {
      cy.get(this._selector)
        .find('tbody tr')
        .each(($el, $rowIndex) => {
          if ($rowIndex != exceptRowIndex) {
            cy.wrap($el)
              .find('td')
              .eq(columnIndex)
              .then(($total) => {
                cellContents.push($total.text().trim())
              })
          }
        })
        .then(() => resolve(cellContents))
    })
  }

  expectSortAscending(subject, columnIndex, exceptRowIndex = '') {
    this.getCellTextAsArray(subject, columnIndex, exceptRowIndex).then(
      (cellContents) => {
        let actual = cellContents.slice()
        expect(actual).to.deep.eq(cellContents.sort())
      }
    )
  }
  expectSortDescending(subject, columnIndex, exceptRowIndex = '') {
    this.getCellTextAsArray(subject, columnIndex, exceptRowIndex).then(
      (cellContents) => {
        let actual = cellContents.slice()
        cy.wrap(actual).should('deep.eq', cellContents.sort().reverse())
      }
    )
  }
}

export default Table
