import InterceptReq from '../../../base/InterceptReq'
import SpyOpenWindowEvent from '../../../base/SpyOpenWindowEvent'

class TrainingReport {
  constructor(baseCopUrl) {
    this.baseCopUrl = baseCopUrl
  }

  itcFetchTrainingReport = new InterceptReq('/training-report/get', 'FetchTrainingReport')

  #getAdminSectionUrl() {
    return this.baseCopUrl.concat('/admin/admin')
  }

  visit() {
    cy.visit(
      `${this.#getAdminSectionUrl()}
    #_copMemberManagementPortlet_option=training-report`,
      { failOnStatusCode: false }
    )
  }

  clickOnTableHeader(columnHeaderName) {
    this.getBaseTableHeader(($header) => {
      this.itcFetchTrainingReport.set()
      this.getTableHeader($header, columnHeaderName).click()
      this.itcFetchTrainingReport.wait()
    })
  }

  clickOnManageColumnIcon() {
    this.getBaseTableHeader(($header) => {
      cy.wrap($header).get('.tabulator-col-title svg').click()
    })
  }

  getTableRows() {
    cy.wrap(null).as('rows')
    cy.get('.tabulator-table').within(($content) => {
      cy.wrap($content).get('.tabulator-row').as('rows')
    })
    return cy.get('@rows')
  }

  clickOnFirstTableRow() {
    this.getTableRows().first().click()
  }

  clickOnViewPublicProfile() {
    const spyOpenWindowEvent = new SpyOpenWindowEvent()
    spyOpenWindowEvent.setSpy()
    cy.getElementWithLabel('View public profile', 'a span').click()
    spyOpenWindowEvent.getUrl().then(($url) => {
      cy.visit($url)
    })
  }

  getTrainingReportResult() {
    return new Cypress.Promise((resolve) => {
      this.itcFetchTrainingReport
        .getResponse()
        .its('response.body.result.data')
        .then((result) => {
          resolve(result)
        })
    })
  }

  addNewTableColumn(columnName) {
    this.#getManageTableColumn(columnName, ($element) => {
      cy.wrap($element).find('input[type="checkbox"]').check()
    })
  }

  removeTableColumn(columnName) {
    this.#getManageTableColumn(columnName, ($element) => {
      cy.wrap($element).find('input[type="checkbox"]').uncheck()
    })
  }

  #getManageTableColumn(columnName, callback = () => {}) {
    cy.getPopup().within(($popup) => {
      cy.wrap($popup)
        .getPopupBody()
        .within(($popupBody) => {
          this.getBasePopupBody(columnName, $popupBody, ($element) => {
            callback($element)
          })
        })
      this.clickOnSetButtonOnPopupFooter($popup)
    })
  }

  getBaseContainerHeader(callback = () => {}) {
    cy.get('.training-report-header').within(($header) => {
      callback($header)
    })
  }

  getAdvancedFilter($header) {
    return cy.wrap($header).getElementWithLabel('Advanced Filters', '.navigation-button button')
  }

  search(text) {
    this.itcFetchTrainingReport.set()
    this.getBaseSearchBox().clear().type(`${text} {enter}`)
    cy.expectOverlayIsVisible()
    cy.waitLoadingOverlayNotExist()
    this.itcFetchTrainingReport.wait()
  }

  getBaseSearchBox() {
    cy.wrap(null).as('searchBox')
    this.getBaseContainerHeader(($header) => {
      cy.wrap($header)
        .get('.search-box-panel-wrapper')
        .within(($content) => {
          cy.wrap($content).inputSearch('Search courses or learners').as('searchBox')
        })
    })
    return cy.get('@searchBox')
  }

  clickOnSetButtonOnPopupFooter($popup) {
    cy.wrap($popup)
      .getPopupFooter()
      .within(() => {
        cy.clickButtonByName('Set')
      })
  }

  getBasePopupBody(columnName, $popupBody, callback = () => {}) {
    cy.wrap($popupBody)
      .get('.input-checkbox-wrapper > label')
      .find(`span:contains("${columnName}")`)
      .parent()
      .within(($element) => {
        callback($element)
      })
  }

  getBaseTableHeader(callback = () => {}) {
    cy.get('.tabulator-headers').within(($header) => {
      callback($header)
    })
  }

  getTableHeader($header, columnHeaderName) {
    return cy.wrap($header).get('.tabulator-col-title').contains(columnHeaderName)
  }
}

export default TrainingReport
