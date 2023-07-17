import BaseGlobalSearch from './base-global-search/BaseGlobalSearch'
import FilesTab from './FilesTab'

class AllTab extends BaseGlobalSearch {
  #maxShowResult = 3

  expectShowSearchResultLabel(searchKeyword, totalResult) {
    this.expectSearchResultNavBarHeader(searchKeyword)
    cy.get('.search-results__list.mt-4')
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(`Showing ${totalResult} results for '${searchKeyword}'`)
      })
  }

  expectViewAllLink(searchKeyword, totalResult) {
    totalResult < this.#maxShowResult
      ? cy.noLink(`View all files for '${searchKeyword}'`)
      : cy.hasLink(
          `View all files for '${searchKeyword}'`,
          `search?p_p_id=directoryServicePortlet&p_p_lifecycle=0&p_p_mode=view&p_r_p_tabs1=others&p_r_p_keywords=${searchKeyword}&_directoryServicePortlet_mvcRenderCommandName=%2Fview`
        )
  }

  expectFoundFilesFolders(
    searchKeyword,
    copName,
    buttonName,
    totalResult = this.#maxShowResult,
    location = ''
  ) {
    const filesTab = new FilesTab()

    cy.get('.search-results__list')
      .eq(1)
      .within(() => {
        cy.expectElementWithLabelVisible('Files', '.search-result-header__title')
        cy.expectElementWithLabelVisible('From', 'p')
        cy.expectElementWithLabelVisible(copName, '.text-primary')

        filesTab.getFileFolderCard(searchKeyword)
        cy.get('@fileFolderCard').should('have.length', totalResult)
        for (let index = 0; index < totalResult; index++) {
          filesTab.expectFileFolderCard(searchKeyword, location, buttonName, index)
        }
      })
    this.expectViewAllLink(searchKeyword, totalResult)
  }

  clickViewAll(searchKeyword) {
    this.setItcFetchGlobalNavigationItems()
    cy.clickLinkByName(`View all files for '${searchKeyword}'`)
    this.waitItcFetchGlobalNavigationItems()
  }
}

export default AllTab
