import InterceptReq from '../base/InterceptReq'
import BaseGlobalSearch from './base-global-search/BaseGlobalSearch'

class GlobalSearch extends BaseGlobalSearch {
  itcFetchConnection = new InterceptReq('/connections/fetch', 'FetchConnection')

  itcFetchDocument = new InterceptReq('/document/fetch', 'FetchDocument')
  visitGlobalSearch() {
    cy.visit('/search')
  }
  initElement() {
    cy.get('#_directoryServicePortlet_navTagNavbarCollapse').as('directoryServiceNavBar')
  }
  search(name) {
    this.setItcFetchGlobalNavigationItems()
    cy.searchGlobal(name)
    this.waitItcFetchGlobalNavigationItems()
    cy.wait(5000)
  }

  clickOnTab(tabName) {
    this.initElement()
    Cypress.on('uncaught:exception', () => false)
    cy.get('@directoryServiceNavBar').within(() => {
      cy.get(`span:contains(${tabName})`).parent().click({ force: true })
    })
  }

  clickFileTab() {
    this.itcFetchDocument.set()
    this.clickOnTab('Files')
    this.itcFetchDocument.wait()
  }

  clickConnectionTab() {
    this.itcFetchConnection.set()
    this.clickOnTab('Connections')
    this.itcFetchConnection.wait()
  }

  expectedFoundUserInGlobalSearch(name) {
    cy.get('.connection-card').within(() => {
      cy.contains('.user-card-title', name).should('be.visible')
    })
  }

  expectedNotFoundFileFolderInGlobalSearch(name) {
    cy.get('#_directoryServicePortlet_search').within(($search) => {
      if ($search.find('.search-results__list').length) {
        cy.get('.search-results__list').each(($content) => {
          cy.wrap($content).expectElementWithLabelNotExist(
            name,
            '.cec-card .cec-card__body .text-primary strong'
          )
        })
      } else {
        cy.get('.search-results__list').should('not.exist')
      }
    })
  }
  expectedFoundCommunityInGlobalSearch(name) {
    cy.get('.search-results__list .cec-card.community-search-tile').within(() => {
      cy.expectElementWithLabelVisible(name, '.cec-card__body')
    })
  }
}

export default GlobalSearch
