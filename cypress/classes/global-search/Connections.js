import GlobalSearch from './GlobalSearch'

class Connections extends GlobalSearch {
  checkPublicPeople() {
    cy.get('#menuBarVerticalNestedCollapsescopes').within(() => {
      cy.get('#public').check()
    })
  }
  checkOrganizationsPeople() {
    cy.get('#menuBarVerticalNestedCollapsescopes').within(() => {
      cy.get('#organizations').check()
    })
  }
  checkMyConnectionsPeople() {
    cy.get('#menuBarVerticalNestedCollapsescopes').within(() => {
      cy.get('#connections').check()
    })
  }
  checkAllTypeInPeopleFilterByOrgUser() {
    this.itcFetchConnection.set()
    this.checkPublicPeople()
    this.checkOrganizationsPeople()
    this.checkMyConnectionsPeople()
    this.itcFetchConnection.wait()
  }
  checkAllTypeInPeopleFilterByNormalUser() {
    this.itcFetchConnection.set()
    this.checkPublicPeople()
    this.checkMyConnectionsPeople()
    this.itcFetchConnection.wait()
  }
  orgUserCanSearchUserInGlobal(screenName) {
    this.search(screenName)
    this.expectedFoundUserInGlobalSearch(screenName)
    this.clickConnectionTab()
    this.checkAllTypeInPeopleFilterByOrgUser()
    this.expectedFoundUserInGlobalSearch(screenName)
  }
  orgUserCannotSearchUserInGlobal(screenName) {
    this.search(screenName)
    cy.showEmptySearchResult(screenName)
    this.clickConnectionTab()
    this.checkAllTypeInPeopleFilterByOrgUser()
    cy.showEmptySearchResult(screenName)
  }
  normalUserCanSearchUserInGlobal(screenName) {
    this.search(screenName)
    this.expectedFoundUserInGlobalSearch(screenName)
    this.clickConnectionTab()
    this.checkAllTypeInPeopleFilterByNormalUser()
    this.expectedFoundUserInGlobalSearch(screenName)
  }
  normalUserCannotSearchUserInGlobal(screenName) {
    this.search(screenName)
    cy.showEmptySearchResult(screenName)
    this.clickConnectionTab()
    this.checkAllTypeInPeopleFilterByNormalUser()
    cy.showEmptySearchResult(screenName)
  }
}
export default Connections
