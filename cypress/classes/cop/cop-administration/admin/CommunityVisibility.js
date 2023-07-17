import Environment from '../../../base/Environment'
import InterceptReq from '../../../base/InterceptReq'
import GlobalSearch from '../../../global-search/GlobalSearch'
import ProductSubscription from '../../../payment/ProductSubscription'

class CommunityVisibility {
  #globalSearch = new GlobalSearch()
  #itcFetchCommunities = new InterceptReq('/communities/get', 'fetchCommunities')

  searchThenExpectCannotFindCop(copName) {
    cy.logInTestCase('Search Global Search')
    this.#globalSearch.search(copName)
    cy.showEmptySearchResult(copName)
  }
  visitThenExpectSeeAccessDenied(copUrl) {
    if (new Environment().isBeta()) {
      // TODO: remove this condition after CW-16103 is fixed
      cy.logInTestCase('Past OCoP Link')
      cy.visit(copUrl)
      cy.thisLinkIsNotAvailable()
    }
  }
  visitThenExpectSeeProductSubscription(copUrl) {
    if (new Environment().isBeta()) {
      // TODO: remove this condition after CW-16103 is fixed
      cy.logInTestCase('Past OCoP Link')
      cy.visit(copUrl)
      new ProductSubscription()._expectProductSubscriptionPage()
    }
  }
  clickOnCommunityTab() {
    this.#itcFetchCommunities.set()
    cy.get('#navTagNavbarCollapse .navbar-nav').within(() => {
      cy.getElementWithLabel('Communities', 'a').click()
    })
    this.#itcFetchCommunities.wait()
  }
  searchCommunity(copName) {
    this.#itcFetchCommunities.set()
    cy.get('#_myCommunitiesPortlet_myCommunities').within(() => {
      cy.inputByName('keywords', copName).type(`{enter}`)
    })
    this.#itcFetchCommunities.wait()
  }
  assertUnlistedCommunityFound(copName) {
    cy.get('#_myCommunitiesPortlet_myCommunities .list-group-item').within(() => {
      cy.expectElementWithLabelVisible(copName, 'a')
      cy.expectElementWithLabelVisible('(Unlisted)', 'span')
    })
  }
  expectUnlistedCopFoundInGlobalSearch(copName) {
    this.#globalSearch.search(`"${copName}"`)
    this.#globalSearch.expectedFoundCommunityInGlobalSearch(copName)
    cy.visitCwDashboard()
  }
  expectUnlistedCopFoundInCommunitySearch(copName) {
    this.clickOnCommunityTab()
    this.searchCommunity(`"${copName}"`)
    this.assertUnlistedCommunityFound(copName)
  }
  expectStandardCopFoundInGlobalSearch(copName) {
    this.#globalSearch.search(`"${copName}"`)
    this.#globalSearch.expectedFoundCommunityInGlobalSearch(copName)
  }
  expectStandardCopFoundInCommunitySearch(copName) {
    cy.visitCwDashboard()
    this.clickOnCommunityTab()
    this.searchCommunity(`"${copName}"`)
    cy.get('#_myCommunitiesPortlet_myCommunities .list-group-item').within(() => {
      cy.expectElementWithLabelVisible(copName, 'a')
      cy.expectElementWithLabelNotExist('(Unlisted)', 'span')
    })
  }
  visitCommunitiesPage() {
    this.#itcFetchCommunities.set()
    cy.visit('/u/home/communities')
    this.#itcFetchCommunities.wait()
  }
  assertCommunityFoundWithoutUnlistedLabel(copName) {
    cy.get('#_myCommunitiesPortlet_myCommunities .list-group-item').within(() => {
      cy.expectElementWithLabelVisible(copName, 'a')
      cy.expectElementWithLabelNotExist('(Unlisted)', 'span')
    })
  }
  expectCopFoundWithoutUnlistedLabel(copName) {
    this.searchCommunity(`"${copName}"`)
    this.assertCommunityFoundWithoutUnlistedLabel(copName)
  }
  expectCopFoundWithUnlistedLabel(copName) {
    this.searchCommunity(`"${copName}"`)
    this.assertUnlistedCommunityFound(copName)
  }
}
export default CommunityVisibility
