import InterceptReq from '../../base/InterceptReq'

class BaseGlobalSearch {
  #itcFetchGlobalNavigationItems = new InterceptReq(
    '/global_navigation/items/fetch',
    'FetchGlobalNavigationItems'
  )

  setItcFetchGlobalNavigationItems() {
    this.#itcFetchGlobalNavigationItems.set()
  }
  waitItcFetchGlobalNavigationItems() {
    this.#itcFetchGlobalNavigationItems.wait()
  }

  expectSearchResultNavBarHeader(searchKeyword) {
    searchKeyword = searchKeyword.includes(`"`) ? searchKeyword.replaceAll(`"`, '') : searchKeyword
    cy.get('.search_result .navbar-header').within(() => {
      cy.expectElementWithLabelVisible('Search Result:', 'span > span')
      cy.expectElementWithLabelVisible(searchKeyword, 'strong')
    })
  }
}
export default BaseGlobalSearch
