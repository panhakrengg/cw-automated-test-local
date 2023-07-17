import TrainingReport from './TrainingReport'

class TrainingReportAssertion extends TrainingReport {
  constructor() {
    super()
  }

  expectToSeeCorrectSearchResult(entry) {
    super.getTableRows().each(($element) => {
      cy.wrap($element)
        .invoke('text')
        .then((text) => expect(text).contains(entry))
    })
  }

  expectToSortByAscending() {
    super.getTrainingReportResult().then((result) => {
      cy.wrap(result.map((c) => c['courseTitle'])).expectSortAscending()
    })
  }

  expectToSortByDescending() {
    super.getTrainingReportResult().then((result) => {
      cy.wrap(result.map((c) => c['courseTitle'])).expectSortDescending()
    })
  }

  expectToSeeEntryTabOnPublicProfile(tabNames) {
    cy.get('.e-toolbar-items')
      .first()
      .within(() => {
        tabNames.forEach((tabName) => {
          cy.expectElementWithLabelVisible(tabName, 'div.e-tab-text')
        })
      })
  }

  expectToSeeLearnerDetailPopup() {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(() => {
          this.#expectElementsToBeVisible(
            ['Public Profile Details', 'Learning details'],
            '.font-weight-bold'
          )
          this.#expectElementsToBeVisible(
            ['Screen Name', 'Account Email', 'Course Title', 'Status'],
            '.text-black div'
          )
          cy.expectElementWithLabelVisible('View public profile', 'a span')
        })
    })
  }

  expectToSeePageNotFound() {
    cy.pageNotFound()
  }

  expectToSeeTrainingReportBaseTitle() {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header).expectElementWithLabelVisible('Training Report', '.header-title div')
    })
  }

  expectToSeeBaseSearchBox() {
    super.getBaseSearchBox().should('be.visible')
  }

  expectToSeeBaseExportButton() {
    super.getBaseContainerHeader(($header) => {
      cy.wrap($header).expectElementWithLabelVisible('Export', '.cw-top-header span')
    })
  }

  expectToSeeBaseAdvancedFilterButton() {
    super.getBaseContainerHeader(($header) => {
      super.getAdvancedFilter($header).should('be.visible')
    })
  }

  expectToSeeDisableHeaderColumnInPopup(columnHeaderNames) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(($popupBody) => {
          columnHeaderNames.forEach((columnHeaderName) => {
            this.#expectToSeeDisableHeaderColumn(columnHeaderName, $popupBody)
          })
        })
      super.clickOnSetButtonOnPopupFooter($popup)
    })
  }

  expectToSeeColumnHeaders(columnHeaderNames) {
    columnHeaderNames.forEach((columnHeaderName) => {
      this.#expectToSeeColumnHeader(columnHeaderName)
    })
  }

  expectNotToSeeColumnHeader(columnHeaderName) {
    super.getBaseTableHeader(($header) => {
      super.getTableHeader($header, columnHeaderName).should('not.be.visible')
    })
  }

  expectToSeeSortIconOnColumnHeaders(columnHeaderNames) {
    columnHeaderNames.forEach((columnHeaderName) => {
      this.#expectToSeeSortIconOnColumnHeader(columnHeaderName)
    })
  }

  #expectToSeeSortIconOnColumnHeader(columnHeaderName) {
    super.getBaseTableHeader(($header) => {
      super.getTableHeader($header, columnHeaderName).within(($content) => {
        cy.wrap($content).find('span.lexicon-icon').should('be.visible')
      })
    })
  }

  expectToSeeExportButton() {
    cy.cecCard().cardRightContent().expectElementWithLabelVisible('Export', 'span')
  }

  expectToSeeSearchBox() {
    cy.get('.course-header .search-box-panel-wrapper')
      .inputSearch('Search learners')
      .should('be.visible')
  }

  expectToSeeTrainingReportTitle() {
    cy.expectElementWithLabelVisible('Training Report', '.course-header h1')
  }

  #expectToSeeColumnHeader(columnHeaderName) {
    super.getBaseTableHeader(($header) => {
      super
        .getTableHeader($header, columnHeaderName)
        .parents('.tabulator-col')
        .invoke('attr', 'style', "display:'inline-block'")
        .contains(`${columnHeaderName}`)
        .should('be.exist')
    })
  }

  #expectToSeeDisableHeaderColumn(columnName, $popupBody) {
    super.getBasePopupBody(columnName, $popupBody, ($element) => {
      cy.wrap($element).isCheckboxDisabled()
    })
  }

  #expectElementsToBeVisible(titles, selector) {
    titles.forEach((title) => {
      cy.expectElementWithLabelVisible(title, selector)
    })
  }
}

export default TrainingReportAssertion
