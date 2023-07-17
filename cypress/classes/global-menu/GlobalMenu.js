import InterceptReq from '../base/InterceptReq'

class GlobalMenu {
  #itcSearchCommunity = new InterceptReq('/community/search', 'searchCommunities')
  setItcSearchCommunity() {
    this.#itcSearchCommunity.set()
  }
  waitSearchCommunity() {
    this.#itcSearchCommunity.wait()
  }
  static openChat() {
    cy.get('.cw-private-messaging > a > .cw-icon').click()
  }
  getHeaderTitle(title = 'Home') {
    return cy.get('div.cw-header-wrapper header').find(`.cw-header__title > a:contains(${title})`)
  }
  getNav(menuHeading, menuItem) {
    return cy
      .get('.cw-navigation__list--heading-text')
      .contains(menuHeading)
      .parents('.cw-navigation__list--container')
      .find(`ul.cw-navigation__list li:contains(${menuItem})`)
      .children('a')
  }
  getLeftHeaderTitle(title = 'Home') {
    return cy
      .get(`.cw-navigation__group--left > .cw-navigation__list > .cw-navigation__item > a`)
      .contains(title)
  }
  checkLeftHeaderTitleExist(title) {
    this.getLeftHeaderTitle(title).should(`exist`)
  }
  checkLeftHeaderTitleNotExist(title) {
    this.getLeftHeaderTitle(title).should(`not.exist`)
  }
  visitCommunities() {
    this.setItcSearchCommunity()
    cy.visit(
      '/search?p_p_id=directoryServicePortlet&p_p_lifecycle=0&p_r_p_tabs1=communities&_directoryServicePortlet_mvcRenderCommandName=%2Fview'
    )
    this.waitSearchCommunity()
  }
  search(keywords) {
    cy.get('#heading').within(($header) => {
      cy.wrap($header).get('input[placeholder = "Search"]').type(`${keywords}{enter}`)
    })
  }
  expectVisible(keywords) {
    cy.get('#_directoryServicePortlet_search').within(($searchPortlet) => {
      cy.wrap($searchPortlet)
        .get('.cec-card__body')
        .contains(keywords)
        .parent()
        .parent()
        .parent()
        .should('be.visible')
    })
  }
  clickExpandGlobalMenu() {
    cy.get('#global-navigation-toggle').click()
  }
  clickNavItemInGlobalMenu(itemName) {
    cy.get('#global-navigation').within(() => {
      cy.get('.cw-services').find(`a:contains(${itemName})`).click()
    })
  }
  expectLearningAdminMenuNotExistInGlobalNavigation() {
    this.clickExpandGlobalMenu()
    cy.get('div.cw-navigation__list--container').should('not.contain.text', 'Learning Admin')
  }
}

export default GlobalMenu
